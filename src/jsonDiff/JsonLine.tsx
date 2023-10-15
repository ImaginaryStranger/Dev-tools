import {Button, Space, Typography} from "antd";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";
import './jsonDiff.css';
import {STATE} from "./jsonDiff.constants.js";

const JsonLine = props => {
    const { lineKey, lineValue, shadowKey, canExpand, isExpanded, setIsExpanded, canCopyValue, state, level } = props;
    const highlightClassName = state === STATE.HAS_UPDATE ? 'update' : state === STATE.ADDED ? 'added' : state === STATE.REMOVED ? 'removed' : ''
    let  levelPadding = level*16+20;
    const formattedLineValue = lineValue === false ? 'false' : lineValue === null ? 'null': lineValue;
    if (canExpand) levelPadding = levelPadding - 24;
    return (
        <div className={highlightClassName} style={{ display: 'flex', width: '100%', paddingTop: '4px', paddingBottom: '4px'}}>
            {
                canExpand && (
                    <Button size={"small"} ghost
                        icon={isExpanded ? <CaretDownOutlined/> : <CaretRightOutlined/>}
                        onClick={() => setIsExpanded()}
                    />
                )
            }
            <div style={{paddingLeft: `${levelPadding}px`}}>
                {(lineKey || lineKey === 0) && <span className={'key-text'}>{lineKey}</span>}
                {(lineKey || lineKey === 0) && <span className={'value-text'}>{' : '}</span>}
                <span className={'value-text'}>{formattedLineValue}</span>
            </div>
        </div>
    );
}

export default JsonLine;
