import { Component } from "react";
import {Alert, Result} from "antd";

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <Result status="500" title="500" subTitle="Произошла ошибка в работе приложения."/>
                </>

            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;