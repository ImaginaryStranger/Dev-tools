import {getJsonDeltaArray, processJsonArray} from "./jsonDiff.helpers";
import {Input, Layout, Space, Button, Radio, Flex, Modal, Form, Typography, Switch} from "antd";
import {useState} from "react";
import {RedoOutlined, UploadOutlined} from "@ant-design/icons";
import JsonAlongside from "./JsonAlongside.jsx";
import TextArea from "antd/es/input/TextArea.js";
import JsonInline from "./JsonInline.jsx";
import _pick from 'lodash/pick';
import _map from "lodash/map.js";


const JsonDiff = (props) => {
  const viewOptions = [{ label: 'Default', value: 'default'}, { label: 'Inline', value: 'inline'}, { label: 'Alongside', value: 'alongside'}];
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [selectedView, setSelectedView] = useState('default')

  const onViewChange = ({ target: { value } }) => {
    setSelectedView(value);

  }
  const [uploadModalStatus, setUploadModalStatus] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleModalOK = (values) => {
    const unprocessedArray = JSON.parse(values['json-array'])
    const processedJson = processJsonArray(unprocessedArray);
    setSearchText('');
    setJsonArray(processedJson);
    setUploadModalStatus(false);
  }

  const handleModalCancel = () => {
    form.resetFields
    setUploadModalStatus(false)
  }

  const onSearchFinish = (searchQuery) => {
    setSearchText(searchQuery['search'])
  }

  const onResetDiffTool = () => {
    searchForm.resetFields();
    setSearchText('')
  }

  const handleSwitchOnChange = (checked) => {
    setIsChecked(checked);
  }

  const [searchText, setSearchText] = useState('');
  const searchArrayWithPath = searchText.split(' ');
  const [jsonArray, setJsonArray] = useState([]);
  const jsonArrayWithPath = searchText === ''? jsonArray :  _map(jsonArray, (json) => _pick(json, searchArrayWithPath));
  const deltaArray = getJsonDeltaArray(jsonArrayWithPath);
  return (
        <>
          <Flex gap="middle" vertical style={{height: '100%'}}>
            <Form style={{ width: '100%' }} form={searchForm} onFinish={onSearchFinish}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item style={{width: '90%'}} name='search'>
                  <Input placeholder="Search" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Search</Button>
                </Form.Item>
              </Space.Compact>
            </Form>
            <Flex style={{width: '100%'}} justify={"flex-end"}>
              <Space>
                <Typography.Text>Only Show differences</Typography.Text>
                <Switch disabled={selectedView === 'default'} defaultChecked={selectedView !== 'default'} onChange={handleSwitchOnChange}/>
                <Radio.Group
                    options={viewOptions}
                    onChange={onViewChange}
                    value={selectedView}
                    optionType="button"
                    buttonStyle="solid"
                />
                <Button icon={<RedoOutlined />} onClick={onResetDiffTool}>Reset JSON</Button>
                <Button icon={<UploadOutlined />} onClick={() => setUploadModalStatus(true)}>Upload JSON Array</Button>
              </Space>
            </Flex>
            <div style={{ flex: 1, overflow: "hidden"}}>
              { selectedView === 'alongside' && <JsonAlongside jsonArray={jsonArrayWithPath} deltaArray={deltaArray} limitedMode={isChecked}/>}
              { (selectedView === 'inline' || selectedView === 'default') && <JsonInline jsonArray={jsonArrayWithPath} deltaArray={deltaArray} isDefaultView={selectedView === 'default'} limitedMode={isChecked}/> }
            </div>
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
              <Form.Item name="json-array" rules={[{ required: true }]}>
                <TextArea  rows={15} placeholder="Enter JSON Array here" />
              </Form.Item>
            </Form>
          </Modal>
        </>
  );
};

export default JsonDiff;
