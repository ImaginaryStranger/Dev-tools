import _size from "lodash/size";
import _get from 'lodash/get';
import _map from 'lodash/map.js';
import {Anchor, Col, Flex, Row, Space, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {STATE} from "./jsonDiff.constants.ts";
import JsonBlock from "./JsonBlock.tsx";
import {epochToDateTimeWithMilliseconds} from "./jsonDiff.helpers.ts";

const JsonAlongside = props => {
    const {jsonArray, deltaArray, limitedMode, jsonArrayMetadata} = props;
    const anchorItems = _map(jsonArray, (_, index: number) => ({
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
                            <div key={`v-${_size(deltaArray) - index + 1}-v${_size(deltaArray) - index}`}
                                 style={{height: 'fit-content', width: '100%'}}>
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
                                <Row className={'json-viewer'} id={_get(anchorItems, [index, 'href'])}
                                     style={{padding: '8px'}}>
                                    <Col span={12}>
                                        <JsonBlock
                                            index={0}
                                            blockKey={''}
                                            blockValue={jsonArray[index + 1]}
                                            delta={delta}
                                            path={''}
                                            state={STATE.HAS_UPDATE}
                                            level={2}
                                            showAdded={true}
                                            showRemoved={false}
                                            limitedMode={limitedMode}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <JsonBlock
                                            index={0}
                                            blockKey={''}
                                            blockValue={jsonArray[index]}
                                            delta={delta}
                                            path={''}
                                            state={STATE.HAS_UPDATE}
                                            level={2}
                                            showAdded={false}
                                            showRemoved={true}
                                            limitedMode={limitedMode}
                                        />
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
