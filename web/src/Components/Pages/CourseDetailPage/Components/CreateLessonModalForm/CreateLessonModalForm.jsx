import useCreateLessonModalForm from "./useCreateLessonModalForm.js";
import {Button, Form, Input, InputNumber, Modal, Upload} from "antd";
import JoditEditor from "jodit-react";
import {UploadOutlined} from "@ant-design/icons";


const CreateLessonModalForm = () => {
    const {
        isModalOpen,
        handleCancel,
        form,
        joditConfig,
        editorRef,
    } = useCreateLessonModalForm();

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            title={"Создание лекционного материала"}
            style={{
                minWidth: "70%",
                minHeight: "80%",
            }}
        >
            <Form
                name={"lesson"}
                form={form}
                layout={"vertical"}
            >
                <Form.Item
                    name="title"
                    label="Название"
                    rules={[{required: true, message: "Пожалуйста, введите название"}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Описание"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="text"
                    label="Текстовый материал"
                >
                    <div className="jodit-container">
                        <JoditEditor
                            ref={editorRef}
                            config={joditConfig}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    name="number"
                    label="Порядковый номер отображения"
                >
                    <InputNumber min={1} defaultValue={1}/>
                </Form.Item>
                <Form.Item name="files" label="Прикрепить файлы">
                    <Upload
                        multiple
                    >
                        <Button icon={<UploadOutlined/>}>Выбрать файлы</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Сохранить</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default CreateLessonModalForm;