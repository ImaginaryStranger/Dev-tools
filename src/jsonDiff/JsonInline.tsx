import _map from "lodash/map.js";
import {Anchor, Col, Flex, Row, Space, Typography} from "antd";
import Title from "antd/es/typography/Title.js";
import JsonDiffReact from "jsondiffpatch-react/lib/jsondiff-for-react.js";
import _size from "lodash/size";
import {STATE} from "./jsonDiff.constants.ts";
import JsonBlock from "./JsonBlock.tsx";
import {epochToDateTimeWithMilliseconds} from "./jsonDiff.helpers.ts";

const JsonInline = (props) => {
    const {jsonArray, deltaArray, isDefaultView, limitedMode, jsonArrayMetadata} = props;
    const anchorItems = _map(jsonArray, (_json, index: number) => ({
        key: `v-${_size(deltaArray) - index + 1}-v${_size(deltaArray) - index}`,
        href: `#v-${_size(deltaArray) - index + 1}-v${_size(deltaArray) - index}`,
        title: `v${_size(deltaArray) - index + 1} vs v${_size(deltaArray) - index}`,
    })).slice(0, -1);
    return (
        <Row style={{height: '100%', width: '100%'}}>
            <Col span={20} style={{height: '100%', width: '100%', overflow: "scroll"}}>
                {
                    _map(deltaArray, (delta, index: number) => {
                        return (
                            <div style={{
                                height: 'fit-content',
                                width: '100%',
                                border: "gray 3px solid",
                                marginBottom: '10px',
                                padding: '4px',
                            }}>

                                <Title id={`v-${_size(deltaArray) - index + 1}-v${_size(deltaArray) - index}`}
                                       level={5}>{`Comparing version ${_size(deltaArray) - index + 1} with version ${_size(deltaArray) - index}`}</Title>
                                <Flex style={{margin: '4px'}} gap={"small"}>
                                    <Space>
                                        <Typography.Text
                                            disabled>{`Version ${_size(deltaArray) - index + 1} created time: `}</Typography.Text>
                                        <Typography.Text
                                            copyable>{epochToDateTimeWithMilliseconds(jsonArrayMetadata[index].createdTime)}</Typography.Text>
                                    </Space>
                                    <Space>
                                        <Typography.Text
                                            disabled>{`Version ${_size(deltaArray) - index} created time: `}</Typography.Text>
                                        <Typography.Text
                                            copyable>{epochToDateTimeWithMilliseconds(jsonArrayMetadata[index + 1].createdTime)}</Typography.Text>
                                    </Space>
                                </Flex>
                                <Flex style={{margin: '4px'}} gap={"small"}>
                                    <Space>
                                        <Typography.Text
                                            disabled>{`Version ${_size(deltaArray) - index + 1} userID: `}</Typography.Text>
                                        <Typography.Text
                                            copyable>{jsonArrayMetadata[index].userId}</Typography.Text>
                                    </Space>
                                    <Space>
                                        <Typography.Text
                                            disabled>{`Version ${_size(deltaArray) - index} userID: `}</Typography.Text>
                                        <Typography.Text
                                            copyable>{jsonArrayMetadata[index + 1].userId}</Typography.Text>
                                    </Space>
                                </Flex>
                                <div className={'json-viewer'}>
                                    {isDefaultView &&
                                        <JsonDiffReact left={jsonArray[index + 1]} right={jsonArray[index]}
                                                       tips={'No Change'} show={true}/>}
                                    {!isDefaultView && <JsonBlock
                                        index={0}
                                        blockKey={''}
                                        blockValue={jsonArray[index]}
                                        delta={delta}
                                        path={''}
                                        state={STATE.HAS_UPDATE}
                                        level={2}
                                        showAdded={true}
                                        showRemoved={true}
                                        limitedMode={limitedMode}
                                    />}
                                </div>
                            </div>

                        );
                    })
                }
            </Col>
            <Col span={4} style={{height: '100%', overflow: "auto"}}>
                <Anchor
                    style={{height: '100%'}}
                    items={anchorItems}
                />
            </Col>
        </Row>
    );
};

export default JsonInline;
