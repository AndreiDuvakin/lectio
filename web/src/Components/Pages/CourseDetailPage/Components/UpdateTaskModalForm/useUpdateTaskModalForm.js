import {useDispatch, useSelector} from "react-redux";
import {Form, notification} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import CONFIG from "../../../../../Core/сonfig.js";
import {
    useDeleteFileMutation,
    useGetTaskFilesListQuery,
    useUpdateTaskMutation,
    useUploadFileMutation
} from "../../../../../Api/tasksApi.js";
import {setSelectedTaskToUpdate} from "../../../../../Redux/Slices/tasksSlice.js";


const useUpdateTaskModalForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const editorRef = useRef(null);

    const {selectedTaskToUpdate} = useSelector((state) => state.tasks);
    const [updateTask, {isLoading: isLoadingUpdateTask}] = useUpdateTaskMutation();

    const isModalOpen = selectedTaskToUpdate !== null;
    const [draftFiles, setDraftFiles] = useState([]);
    const [uploadFile] = useUploadFileMutation();
    const [deleteFileMut] = useDeleteFileMutation();
    const [downloadingFiles, setDownloadingFiles] = useState({});
    const [deletingFiles, setDeletingFiles] = useState({});

    const {
        data: currentTaskFiles = [],
        isLoading: isCurrentTaskFilesLoading,
        isError: isCurrentTaskFilesError
    } = useGetTaskFilesListQuery(selectedTaskToUpdate?.id, {
        skip: !selectedTaskToUpdate?.id
    });

    const downloadFile = async (fileId, fileName) => {
        try {
            setDownloadingFiles((prev) => ({ ...prev, [fileId]: true }));

            const token = localStorage.getItem('access_token');
            if (!token) {
                notification.error({
                    title: "Ошибка",
                    description: "Токен не найден",
                    placement: "topRight",
                });
                return;
            }

            const response = await fetch(`${CONFIG.BASE_URL}/tasks/file/${fileId}/`, {
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

    const deleteFile = async (fileId, fileName) => {
        try {
            setDeletingFiles((prev) => ({...prev, [fileId]: true}));
            await deleteFileMut(fileId).unwrap();
            notification.success({
                title: "Файл удален",
                description: `Файл ${fileName || "неизвестный"} успешно удален.`,
                placement: "topRight",
            });
        } catch (error) {
            console.error("Error deleting file:", error);
            notification.error({
                title: "Ошибка при удалении файла",
                description: `Не удалось удалить файл ${fileName || "неизвестный"}: ${error.data?.detail || error.message}`,
                placement: "topRight",
            });
        } finally {
            setDeletingFiles((prev) => ({...prev, [fileId]: false}));
        }
    };

    useEffect(() => {
        if (selectedTaskToUpdate && isModalOpen) {
            form.setFieldsValue({
                title: selectedTaskToUpdate.title || "",
                description: selectedTaskToUpdate.description || "",
                number: selectedTaskToUpdate.number || 1,
            });

            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.value = selectedTaskToUpdate.text || "";
                }
            }, 0);
        }
    }, [selectedTaskToUpdate, isModalOpen, form]);

    const handleCancel = () => {
        form.resetFields();
        if (editorRef.current) {
            editorRef.current.value = "";
        }
        dispatch(setSelectedTaskToUpdate(null));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const content = editorRef.current?.value || "";

            const taskData = {
                title: values.title,
                description: values.description || null,
                text: content,
                number: values.number,
            };

            await updateTask({
                taskId: selectedTaskToUpdate.id,
                taskData,
            }).unwrap();

            for (const file of draftFiles) {
                try {
                    await uploadFile({
                        task_id: selectedTaskToUpdate.id,
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
                description: "Лекция успешно обновлена!",
            });

            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось обновить лекцию",
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
            placeholder: "Заполните содержимое лекционного материала",
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

    const handleRemoveFile = (file) => {
        setDraftFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const initialContent = selectedTaskToUpdate?.text || "";

    return {
        isModalOpen,
        handleCancel,
        handleOk,
        form,
        joditConfig,
        editorRef,
        isLoading: isLoadingUpdateTask,
        initialContent,
        currenttask: selectedTaskToUpdate,
        currentTaskFiles,
        isFilesLoading: isCurrentTaskFilesLoading,
        downloadFile,
        files: currentTaskFiles,
        downloadingFiles,
        deletingFiles,
        deleteFile,
        draftFiles,
        handleAddFile,
        handleRemoveFile,
    };
};

export default useUpdateTaskModalForm;