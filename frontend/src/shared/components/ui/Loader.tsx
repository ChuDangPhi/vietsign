import React from "react";
import { Spin } from "antd";

const Loader: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <Spin size="large" />
    </div>
);

export default Loader;
