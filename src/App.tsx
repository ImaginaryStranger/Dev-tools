import {Layout, Menu } from "antd";
import {Content, Header} from "antd/es/layout/layout";
// @ts-ignore
import JsonDiffDashboard from './jsonDiff/JsonDiffDashboard'
import Title from "antd/es/typography/Title";

function App() {
    const dashboardOptions = [{
        key: 'json-diff-tool',
        label: 'JSON diff tool'
    }]
  return (
      <Layout style={{ height: '100%', width: '100vw'}}>
          <Header style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: '#0C1117FF'}}>
              <Title level={3} style={{ marginRight: '2rem', color: 'white' }}>Dev Tool</Title>
              <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['json-diff-tool']}
                  style={{ height: '100%', borderRight: 0 }}
                  items={dashboardOptions}
              />
          </Header>
          <Layout>
                  <Layout>
                      <Content style={{
                          padding: 24,
                          margin: 0,
                          height: '100%'
                      }}>
                        <JsonDiffDashboard />
                      </Content>
                  </Layout>
          </Layout>
      </Layout>
  );
}

export default App;
