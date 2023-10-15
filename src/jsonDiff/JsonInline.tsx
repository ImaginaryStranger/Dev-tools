import _map from "lodash/map.js";
import {Anchor, Col, Row} from "antd";
import Title from "antd/es/typography/Title.js";
import {useId} from "react";
import _get from "lodash/get.js";
import JsonViewer from "./JsonViewer.jsx";
import JsonDiffReact from "jsondiffpatch-react/lib/jsondiff-for-react.js";
import _size from "lodash/size";

const JsonInline = props => {
    const { jsonArray, deltaArray, isDefaultView, limitedMode } = props;
    const anchorItems = _map(jsonArray, (json, index) => ({
        key: `v-${_size(deltaArray) - index+1}-v${_size(deltaArray) - index}`,
        href: `#v-${_size(deltaArray) - index+1}-v${_size(deltaArray) - index}`,
        title: `v${_size(deltaArray) - index+1} vs v${_size(deltaArray) - index}`,
    })).slice(0, -1);
    return (
        <Row style={{ height: '100%', width: '100%'}}>
            <Col span={20} style={{ height: '100%', width: '100%', overflow: "scroll"}}>
                {
                    _map(deltaArray, (delta, index) => {
                        return (
                            <div>
                                <Title id={`v-${_size(deltaArray) - index+1}-v${_size(deltaArray) - index}`} level={5}>{`Comparing version ${_size(deltaArray) - index+1} with version ${_size(deltaArray) - index}`}</Title>
                                {isDefaultView && <JsonDiffReact left={jsonArray[index+1]} right={jsonArray[index]} tips={'No Change'} show={true}/>}
                                {!isDefaultView && <JsonViewer json={jsonArray[index]} delta={delta} showAdded={true} showRemoved={true} limitedMode={limitedMode}/>}
                            </div>
                        );
                    })
                }
            </Col>
            <Col span={4}>
                <Anchor
                    style={{height: '100%'}}
                    items={anchorItems}
                />
            </Col>
        </Row>
    );
};

export default JsonInline;
