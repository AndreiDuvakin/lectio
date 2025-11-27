import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import useLoadingIndicatorUI from "./useLoadingIndicator.js";

const LoadingIndicator = () => {
    const {containerStyle, iconStyle} = useLoadingIndicatorUI();

    return (
        <div style={containerStyle}>
            <Spin indicator={<LoadingOutlined style={iconStyle} spin/>}/>
        </div>
    );
};

export default LoadingIndicator;