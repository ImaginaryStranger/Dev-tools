import {getFilteredJson, getJsonArrayMetadata, getJsonDeltaArray, processJsonArray} from "./jsonDiff.helpers";
import {
    Alert,
    Button,
    Checkbox,
    Flex,
    Form,
    Input,
    Modal,
    Radio,
    RadioChangeEvent,
    Space,
    Switch,
    Tooltip,
    Typography
} from "antd";
import {useState} from "react";
import {RedoOutlined, UploadOutlined} from "@ant-design/icons";
import JsonAlongside from "./JsonAlongside.jsx";
import TextArea from "antd/es/input/TextArea.js";
import JsonInline from "./JsonInline.jsx";
import {INITIAL_SEARCH_QUERY} from "./jsonDiff.constants.ts";


const JsonDiffDashboard = ({isDarkModeEnabled}: { isDarkModeEnabled: boolean }) => {
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [selectedView, setSelectedView] = useState('default')
    const [uploadModalStatus, setUploadModalStatus] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const viewOptions: { label: string, value: string }[] = [{label: 'Default', value: 'default'}, {label: 'Inline', value: 'inline'}, {
        label: 'Alongside',
        value: 'alongside'
    }];
    const [jsonArrayMetadata, setJsonArrayMetadata] = useState([]);
    const onViewChange = ({target: {value}}: RadioChangeEvent) => {
        setSelectedView(value);
    }

    const handleModalOK = (values) => {
        const unprocessedArray = JSON.parse(values['json-array'])
        const processedJson = processJsonArray(unprocessedArray);
        console.log(unprocessedArray)
        setJsonArrayMetadata(getJsonArrayMetadata(unprocessedArray))
        console.log(jsonArrayMetadata)
        setSearchQuery(INITIAL_SEARCH_QUERY)
        setJsonArray(processedJson);
        setUploadModalStatus(false);
    }

    const handleModalCancel = () => {
        form.resetFields
        setUploadModalStatus(false)
    }

    const onSearchFinish = (searchQuery) => {
        console.log(searchQuery);
        setSearchQuery({
            searchText: searchQuery['search'],
            isNestedSearchEnabled: searchQuery['nested-search'] ? searchQuery['nested-search'] : false,
            searchType: searchQuery['search-type'] ? searchQuery['search-type'] : 'search-path-keys',
        });
    }

    const onResetDiffTool = () => {
        searchForm.resetFields();
        setSearchQuery(INITIAL_SEARCH_QUERY)
    }

    const handleSwitchOnChange = (checked) => {
        setIsChecked(checked);
    }

    const onNestedCheckboxChange = ({target: {checked}}) => {
        console.log(checked)
        setSearchQuery((query) => ({
            ...query,
            isNestedSearchEnabled: checked,
        }))
    }
    const [searchQuery, setSearchQuery] = useState(INITIAL_SEARCH_QUERY);
    const [jsonArray, setJsonArray] = useState([]);
    const filteredJson = getFilteredJson(jsonArray, searchQuery);
    const deltaArray = getJsonDeltaArray(filteredJson);

    return (
        <div className={isDarkModeEnabled ? 'dark-mode' : 'light-mode'} style={{height: '100%'}}>
            <Flex gap="middle" vertical style={{height: '100%'}}>
                <Form style={{width: '100%'}} form={searchForm} onFinish={onSearchFinish}>
                    <Flex style={{width: '100%'}} gap={"small"}>
                        <Space.Compact style={{display: 'flex', flex: 1}}>
                            <Tooltip placement={'bottomLeft'}
                                     title={'Search for paths in dot notation. You can enter multiple paths separated by spaces.'}>
                                <Form.Item name='search' style={{flex: 1}}>
                                    <Input
                                        placeholder=""/>
                                </Form.Item>
                            </Tooltip>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Search</Button>
                            </Form.Item>
                        </Space.Compact>
                        <Form.Item name='nested-search' valuePropName="checked">
                            <Checkbox onChange={onNestedCheckboxChange}>Nested search</Checkbox>
                        </Form.Item>
                        <Form.Item name={'search-type'}>
                            <Radio.Group
                                options={[{label: 'search keys by path', value: 'search-path-keys'}, {label: 'search keys by name', value: 'search-name-keys'}, {label: 'search values', value: 'search-values'}]}
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue={'search-path-keys'}
                            />
                        </Form.Item>
                    </Flex>
                </Form>
                <Flex style={{width: '100%'}} justify={"flex-end"}>
                    <Space>
                        <Typography.Text>Only Show differences</Typography.Text>
                        <Switch disabled={selectedView === 'default'} defaultChecked={selectedView !== 'default'}
                                onChange={handleSwitchOnChange}/>
                        <Radio.Group
                            options={viewOptions}
                            onChange={onViewChange}
                            value={selectedView}
                            optionType="button"
                            buttonStyle="solid"
                        />
                        <Button icon={<RedoOutlined/>} onClick={onResetDiffTool}>Reset JSON</Button>
                        <Button icon={<UploadOutlined/>} onClick={() => setUploadModalStatus(true)}>Upload JSON
                            Array</Button>
                    </Space>
                </Flex>
                <div style={{flex: 1, overflow: "hidden"}}>
                    {selectedView === 'alongside' &&
                        <JsonAlongside jsonArray={filteredJson} deltaArray={deltaArray} limitedMode={isChecked}
                                       isDarkModeEnable={isDarkModeEnabled} jsonArrayMetadata={jsonArrayMetadata}/>}
                    {(selectedView === 'inline' || selectedView === 'default') &&
                        <JsonInline jsonArray={filteredJson} deltaArray={deltaArray}
                                    isDefaultView={selectedView === 'default'} limitedMode={isChecked}
                                    jsonArrayMetadata={jsonArrayMetadata}/>}
                </div>
                {searchQuery.isNestedSearchEnabled && <Alert
                    message="Nested searches may experience decreased efficiency when encountering multiple levels of nesting."
                    type="warning"
                />}
            </Flex>
            <Modal
                title="Upload JSON array"
                centered
                open={uploadModalStatus}
                onOk={form.submit}
                onCancel={handleModalCancel}
                width={1000}
            >
                <Form form={form} onFinish={handleModalOK}>
                    <Form.Item name="json-array" rules={[{required: true}]}>
                        <TextArea rows={15} placeholder="Enter JSON Array here"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default JsonDiffDashboard;
