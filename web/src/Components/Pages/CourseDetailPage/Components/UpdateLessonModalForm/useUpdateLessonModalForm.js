import {useDispatch, useSelector} from "react-redux";
import {Form, notification} from "antd";
import {useEffect, useMemo, useRef} from "react";
import {useUpdateLessonMutation} from "../../../../../Api/lessonsApi.js";
import {setSelectedLessonToUpdate} from "../../../../../Redux/Slices/lessonsSlice.js";


const useUpdateLessonModalForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const editorRef = useRef(null);

    const {selectedLessonToUpdate} = useSelector((state) => state.lessons);
    const [updateLesson, {isLoading}] = useUpdateLessonMutation();

    const isModalOpen = selectedLessonToUpdate !== null;

    useEffect(() => {
        if (selectedLessonToUpdate && isModalOpen) {
            form.setFieldsValue({
                title: selectedLessonToUpdate.title || "",
                description: selectedLessonToUpdate.description || "",
                number: selectedLessonToUpdate.number || 1,
            });

            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.value = selectedLessonToUpdate.text || "";
                }
            }, 0);
        }
    }, [selectedLessonToUpdate, isModalOpen, form]);

    const handleCancel = () => {
        form.resetFields();
        if (editorRef.current) {
            editorRef.current.value = "";
        }
        dispatch(setSelectedLessonToUpdate(null));
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const content = editorRef.current?.value || "";

            const lessonData = {
                title: values.title,
                description: values.description || null,
                text: content,
                number: values.number,
            };

            await updateLesson({
                lessonId: selectedLessonToUpdate.id,
                lessonData,
            }).unwrap();

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

    const initialContent = selectedLessonToUpdate?.text || "";

    return {
        isModalOpen,
        handleCancel,
        handleOk,
        form,
        joditConfig,
        editorRef,
        isLoading,
        initialContent,
        currentLesson: selectedLessonToUpdate,
    };
};

export default useUpdateLessonModalForm;