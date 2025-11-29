import {useDispatch, useSelector} from "react-redux";
import {setSelectedTaskToView} from "../../../../../Redux/Slices/tasksSlice.js";
import {Form, notification} from "antd";
import CONFIG from "../../../../../Core/сonfig.js";
import {useMemo, useRef, useState} from "react";
import {useGetTaskFilesListQuery} from "../../../../../Api/tasksApi.js";
import {useGetAuthenticatedUserDataQuery} from "../../../../../Api/usersApi.js";
import {
    useCreateAssessmentMutation,
    useCreateSolutionMutation, useDeleteSolutionMutation, useGetTaskSolutionsQuery,
    useGetTaskStudentSolutionsQuery,
    useUploadFileMutation
} from "../../../../../Api/solutionsApi.js";
import {ROLES} from "../../../../../Core/constants.js";
import {useCreateCommentMutation} from "../../../../../Api/commentsApi.js";


const useViewTaskModal = () => {
    const dispatch = useDispatch();

    const {
        selectedTaskToView
    } = useSelector((state) => state.tasks);

    const [assessmentForm] = Form.useForm();

    const [
        createSolution,
        {
            isLoading: isCreatingSolution,
            isError: isErrorCreatingSoltion
        }
    ] = useCreateSolutionMutation();

    const modalIsOpen = selectedTaskToView !== null;

    const [draftFiles, setDraftFiles] = useState([]);
    const [uploadFile] = useUploadFileMutation();
    const [deleteSolution] = useDeleteSolutionMutation();

    const [createComment, {
        isLoading: isCreatingComment,
        isError: isErrorCreatingComment
    }] = useCreateCommentMutation();

    const onCommentSubmit = async (solutionId, commentText) => {
        if (!commentText?.trim()) return;

        try {
            await createComment({
                solutionId: solutionId,
                comment: {
                    comment_text: commentText.trim()
                }
            }).unwrap();
            commentForm.resetFields();
            notification.success({
                message: "Комментарий отправлен",
                description: "Ваш комментарий успешно добавлен",
            });
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: error?.data?.detail || "Не удалось отправить комментарий",
            });
        }
    };

    const handleAddFile = (file) => {
        const maxSize = 50 * 1024 * 1024; // 50 мегабайт
        if (file.size > maxSize) {
            notification.error({
                message: "Ошибка вставки",
                description: "Файл слишком большой.",
                placement: "topRight",
            });
            return false;
        }
        setDraftFiles((prev) => [...prev, file]);
        return false;
    };

    const handleDeleSolution = async (solutionId) => {
        try {
            await deleteSolution(solutionId);

            notification.success({
                title: "Успех",
                description: "Задание успешно удалено!",
                placement: "topRight",
            })
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось удалить задание",
                placement: "topRight",
            })
        }
    };

    const handleRemoveFile = (file) => {
        setDraftFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const editorRef = useRef(null);

    const handleOk = async () => {
        try {
            const content = editorRef.current?.value || "";

            const solutionData = {
                answer_text: content,
            };

            const response = await createSolution({
                taskId: selectedTaskToView?.id,
                solution: solutionData,
            }).unwrap();

            for (const file of draftFiles) {
                try {
                    await uploadFile({
                        solutionId: response.id,
                        fileData: file,
                    }).unwrap();
                } catch (error) {
                    console.error(`Error uploading file ${file.name}:`, error);
                    const errorMessage = error.data?.detail
                        ? JSON.stringify(error.data.detail, null, 2)
                        : JSON.stringify(error.data || error.message || "Неизвестная ошибка", null, 2);
                    notification.error({
                        title: "Ошибка загрузки файла",
                        description: `Не удалось загрузить файл ${file.name}: ${errorMessage}`,
                        placement: "topRight",
                    });
                }
            }
            setDraftFiles([]);
            notification.success({
                title: "Успех",
                description: "Задание успешно создано!",
                placement: "topRight",
            });

            if (editorRef.current) {
                editorRef.current.value = "";
            }
        } catch (error) {
            console.error(error)
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось создать задание",
                placement: "topRight",
            });
        }
    };

    const handleClose = () => {
        dispatch(setSelectedTaskToView(null));
    };


    const {
        data: currentTaskFiles = [],
        isLoading: isCurrentTaskFilesLoading,
        isError: isCurrentTaskFilesError
    } = useGetTaskFilesListQuery(selectedTaskToView?.id, {
        skip: !selectedTaskToView?.id
    });

    const {
        data: currentUser = {},
        isLoading: isCurrentUserLoading,
        isError: isCurrentUserError,
    } = useGetAuthenticatedUserDataQuery();

    const {
        data: mySolutions = [],
        isLoading: isMySolutionsLoading,
        isError: isMySolutionsError
    } = useGetTaskStudentSolutionsQuery({
        taskId: selectedTaskToView?.id,
        studentId: currentUser?.id
    }, {
        skip: !selectedTaskToView?.id || currentUser?.role?.title !== ROLES.STUDENT,
        pollingInterval: 5000,
    });

    const {
        data: allSolutions = [],
        isLoading: isAllSolutionsLoading,
    } = useGetTaskSolutionsQuery(selectedTaskToView?.id, {
        skip: !selectedTaskToView?.id || ![ROLES.TEACHER, ROLES.ADMIN].includes(currentUser?.role?.title),
        pollingInterval: 5000,
    })

    const [commentForm] = Form.useForm();
    const [downloadingFiles, setDownloadingFiles] = useState({});

    const downloadFile = async (fileId, fileName) => {
        try {
            setDownloadingFiles((prev) => ({...prev, [fileId]: true}));

            const token = localStorage.getItem('access_token');
            if (!token) {
                notification.error({
                    title: "Ошибка",
                    description: "Токен не найден",
                    placement: "topRight",
                });
                return;
            }


            const response = await fetch(`${CONFIG.BASE_URL}/solutions/file/${fileId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                notification.error({
                    title: "Ошибка",
                    description: errorText || "Не удалось скачать файл",
                    placement: "topRight",
                });
                return;
            }


            const contentType = response.headers.get('content-type');
            if (!contentType || contentType.includes('text/html')) {
                const errorText = await response.text();
                notification.error({
                    title: "Ошибка",
                    description: errorText || "Не удалось скачать файл",
                    placement: "topRight",
                });
                return;
            }

            let safeFileName = fileName || "file";
            if (!safeFileName.match(/\.[a-zA-Z0-9]+$/)) {
                if (contentType.includes('application/pdf')) {
                    safeFileName += '.pdf';
                } else if (contentType.includes('image/jpeg')) {
                    safeFileName += '.jpg';
                } else if (contentType.includes('image/png')) {
                    safeFileName += '.png';
                } else {
                    safeFileName += '.bin';
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", safeFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error.message || "Не удалось скачать файл",
                placement: "topRight",
            });
        } finally {
            setDownloadingFiles((prev) => ({...prev, [fileId]: false}));
        }
    };

    const [
        createAssessment,
    ] = useCreateAssessmentMutation();

    const onAssessmentFinish = async (solutionId) => {
        const values = await assessmentForm.validateFields();
        try {
            await createAssessment({
                solutionId,
                assessment: values,
            });

            notification.success({
                title: "Успех",
                description: "Оценка выставлена",
                placement: "topRight",
            });
        } catch (e) {
            notification.error({
                title: "Ошибка",
                description: e.message || "Не удалось выставить оценку",
                placement: "topRight",
            });
        }
    };

    const joditConfig = useMemo(
        () => ({
            readonly: false,
            height: 150,
            toolbarAdaptive: false,
            buttons: [
                "bold", "italic", "underline", "strikethrough", "|",
                "superscript", "subscript", "|",
                "ul", "ol", "outdent", "indent", "|",
                "font", "fontsize", "brush", "paragraph", "|",
                "align", "hr", "|",
                "table", "link", "image", "video", "symbols", "|",
                "undo", "redo", "cut", "copy", "paste", "selectall", "eraser", "|",
                "find", "source", "fullsize", "print", "preview",
            ],
            autofocus: false,
            preserveSelection: true,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: "insert_clear_html",
            spellcheck: true,
            placeholder: "Заполните содержимое задания",
            showCharsCounter: true,
            showWordsCounter: true,
            showXPathInStatusbar: false,
            toolbarSticky: true,
            toolbarButtonSize: "middle",
            cleanHTML: {
                removeEmptyElements: true,
                replaceNBSP: false,
            },
            hotkeys: {
                "ctrl + shift + f": "find",
                "ctrl + b": "bold",
                "ctrl + i": "italic",
                "ctrl + u": "underline",
            },
            image: {
                editSrc: true,
                editTitle: true,
                editAlt: true,
                openOnDblClick: false,
            },
            video: {
                allowedSources: ["youtube", "vimeo"],
            },
            uploader: {
                insertImageAsBase64URI: true,
            },
            paste: {
                insertAsBase64: true,
                mimeTypes: ["image/png", "image/jpeg", "image/gif"],
                maxFileSize: 5 * 1024 * 1024,
                error: () => {
                    notification.error({
                        title: "Ошибка вставки",
                        description: "Файл слишком большой или неподдерживаемый формат.",
                        placement: "topRight",
                    });
                },
            },
        }),
        []
    );

    return {
        selectedTaskToView,
        modalIsOpen,
        handleClose,
        currentTaskFiles,
        isCurrentTaskFilesLoading,
        isCurrentTaskFilesError,
        downloadFile,
        downloadingFiles,
        currentUser,
        mySolutions,
        editorRef,
        joditConfig,
        handleAddFile,
        handleRemoveFile,
        handleOk,
        draftFiles,
        handleDeleSolution,
        allSolutions,
        onAssessmentFinish,
        assessmentForm,
        onCommentSubmit,
    }
};

export default useViewTaskModal;