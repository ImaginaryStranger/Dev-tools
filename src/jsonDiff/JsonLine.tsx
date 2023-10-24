import {Button} from "antd";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";
import './jsonDiff.css';
import {STATE} from "./jsonDiff.constants.js";

const JsonLine = props => {
    const {lineKey, lineValue, canExpand, isExpanded, setIsExpanded, state, level} = props;
    const highlightClassName = state === STATE.HAS_UPDATE ? 'line-update' : state === STATE.ADDED ? 'line-added' : state === STATE.REMOVED ? 'line-removed' : ''
    let levelPadding = level * 16 + 20;
    const formattedLineValue = lineValue === false ? 'false' : lineValue === null ? 'null' : lineValue === true ? 'true' : lineValue;
    if (canExpand) levelPadding = levelPadding - 24;
    if (lineValue === '') return undefined;
    return (
        <div className={lineValue === '' ? '' : highlightClassName}
             style={{
                 display: 'flex',
                 width: '100%',
                 paddingTop: '4px',
                 paddingBottom: '4px',
                 height: '32px',
                 alignItems: 'center'
             }}>
            {
                canExpand && (
                    <Button style={{color: 'gray'}} size={"small"} ghost
                            icon={isExpanded ? <CaretDownOutlined/> : <CaretRightOutlined/>}
                            onClick={() => setIsExpanded()}
                    />
                )
            }
            <div style={{paddingLeft: `${levelPadding}px`}}>
                {(lineKey || lineKey === 0) && <span className={'json-key'}>{lineKey}</span>}
                {(lineKey || lineKey === 0) && <span className={'json-separator'}>{' : '}</span>}
                <span className={'json-value'}>{formattedLineValue}</span>
            </div>
        </div>
    );
}

export default JsonLine;
