import {useDispatch, useSelector} from "react-redux";
import {setOpenModalCreateLesson} from "../../../../../Redux/Slices/lessonsSlice.js";
import {Form, notification} from "antd";
import {useMemo, useRef, useState} from "react";
import {useCreateLessonMutation, useUploadFileMutation} from "../../../../../Api/lessonsApi.js";


const useCreateLessonModalForm = ({courseId}) => {
    const dispatch = useDispatch();
    const {
        openModalCreateLesson
    } = useSelector((state) => state.lessons);
    const [form] = Form.useForm();

    const [createLesson, {isLoading}] = useCreateLessonMutation();
    const [draftFiles, setDraftFiles] = useState([]);
    const [uploadFile] = useUploadFileMutation();

    const isModalOpen = openModalCreateLesson;
    const editorRef = useRef(null);

    const handleCancel = () => {
        form.resetFields();
        if (editorRef.current) {
            editorRef.current.value = "";
        }
        dispatch(setOpenModalCreateLesson(false));
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

    const handleRemoveFile = (file) => {
        setDraftFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const content = editorRef.current?.value || "";

            const lessonData = {
                title: values.title,
                description: values.description || null,
                text: content,
                number: values.number || 1,
            };

             const response = await createLesson({
                courseId,
                lessonData,
            }).unwrap();

            for (const file of draftFiles) {
                try {
                    await uploadFile({
                        lesson_id: response.id,
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

            notification.success({
                title: "Успех",
                description: "Лекция успешно создана!",
                placement: "topRight",
            });

            handleCancel();
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error?.data?.detail || "Не удалось создать лекцию",
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
            placeholder: "Введите результаты приёма...",
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
        isModalOpen,
        handleCancel,
        form,
        joditConfig,
        editorRef,
        handleOk,
        handleAddFile,
        handleRemoveFile,
        draftFiles,
    }
};

export default useCreateLessonModalForm;