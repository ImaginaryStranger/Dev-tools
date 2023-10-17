import {Flex, Layout, Menu, Switch} from "antd";
import {Content, Header} from "antd/es/layout/layout";

import JsonDiffDashboard from './jsonDiff/JsonDiffDashboard'
import Title from "antd/es/typography/Title";
import {useState} from "react";

function App() {
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
    const dashboardOptions: { key: string, label: string }[] = [{
        key: 'json-diff-tool',
        label: 'JSON diff tool'
    }]
    const onChangeDarkModeSwitch = (value: boolean) => {
        setIsDarkModeEnabled(value);
    }
    return (
        <Layout style={{height: '100%', width: '100vw'}}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0C1117FF'
                }}>
                <Flex>
                    <Title level={3} style={{marginRight: '2rem', color: 'white'}}>Dev Tool</Title>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['json-diff-tool']}
                        style={{height: '100%', borderRight: 0}}
                        items={dashboardOptions}
                    />
                </Flex>
                <Switch onChange={onChangeDarkModeSwitch}/>
            </Header>
            <Layout>
                <Layout>
                    <Content style={{
                        padding: 24,
                        margin: 0,
                        height: '100%'
                    }}>
                        <JsonDiffDashboard isDarkModeEnabled={isDarkModeEnabled}/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default App;
