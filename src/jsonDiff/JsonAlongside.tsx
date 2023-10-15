import _size from "lodash/size";
import _get from 'lodash/get';
import _map from 'lodash/map.js';
import {Row, Col,, Flex, Anchor, Typography, Space} from "antd";
import JsonViewer from "./JsonViewer.jsx";
import {useId} from "react";
import Title from "antd/es/typography/Title";

const JsonAlongside = props => {
    const { jsonArray, deltaArray, limitedMode } = props;
    const anchorItems = _map(jsonArray, (json, index) => ({
        key: `v-${_size(deltaArray)-index+1}-v${_size(deltaArray)-index}`,
        href: `#v-${_size(deltaArray)-index+1}-v${_size(deltaArray)-index}`,
        title: `v${_size(deltaArray)-index+1} vs v${_size(deltaArray)-index}`,
    })).slice(0, -1);
    return (
        <Row style={{ height: '100%', width: '100%'}}>
            <Col span={20} style={{ height: '100%', width: '100%', overflow: "scroll"}}>
                {
                    _map(deltaArray, (delta, index) => {
                        return (
                            <div key={`v-${_size(deltaArray)-index+1}-v${_size(deltaArray)-index}`} style={{ height: 'fit-content', width: '100%'}}>
                                <Title id={`v-${_size(deltaArray)-index+1}-v${_size(deltaArray)-index}`} level={5}>{`Comparing version ${_size(deltaArray)-index+1} with version ${_size(deltaArray)-index}`}</Title>
                                <Row id={_get(anchorItems, [index, 'href'])}>
                                    <Col span={12}>
                                        <JsonViewer json={jsonArray[index+1]} delta={delta} showAdded={true} showRemoved={false} limitedMode={limitedMode}/>
                                    </Col>
                                    <Col span={12}>
                                        <JsonViewer json={jsonArray[index]} delta={delta} showAdded={false} showRemoved={true} limitedMode={limitedMode}/>
                                    </Col>
                                </Row>
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

export default JsonAlongside;
