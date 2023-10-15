import React, {useId, useState} from "react";

import _map from "lodash/map";
import _get from "lodash/get";
import _size from 'lodash/size.js';
import _isEmpty from 'lodash/isEmpty.js';
import _isNull from 'lodash/isNull.js';

import JsonLine from "./JsonLine";
import { STATE } from './jsonDiff.constants.js';
import {Flex} from "antd";
import {countBlockKeys} from "./jsonDiff.helpers.js";

const JsonBlock = props => {
    const { index, blockKey, blockValue, delta, path, state, level, showAdded=false, showRemoved=false, limitedMode } = props;
    const [isBlockExpanded, setIsBlockExpanded] = useState(path === '');

    const renderBlockOrLine = ({index, shouldRenderBlock, key, value, currentPath, state, level}) => {
        return shouldRenderBlock ? (
            <JsonBlock
                key={currentPath}
                index={index}
                blockKey={key}
                blockValue={value}
                delta={delta}
                path={currentPath}
                state={state}
                level={level+1}
                showAdded={showAdded}
                showRemoved={showRemoved}
                limitedMode={limitedMode}
            />
        ) : (
            <JsonLine key={currentPath} lineKey={key} lineValue={value} state={state} level={level}/>
        )
    };

    let nextIndex = index;

    const renderBlockLines = () => {
        return _map(blockValue, (value, key) => {
            const currentPath = path + '.' + key;
            const keyDelta = _get(delta, currentPath.substring(1));
            const shouldRenderBlock = (Array.isArray(value) || typeof value === "object");
            nextIndex = shouldRenderBlock ? countBlockKeys(value) + nextIndex + 1 : nextIndex + 1;
            if (!keyDelta ) {
                if (limitedMode) return undefined;
                return renderBlockOrLine({
                    index: nextIndex-1,
                    shouldRenderBlock,
                    key,
                    value,
                    currentPath,
                    state: state === STATE.ADDED ? state : STATE.NO_UPDATE,
                    level
                })
            }

            if (Array.isArray(keyDelta)) {
                switch (_size(keyDelta)) {
                    case 1:
                        return renderBlockOrLine({
                            index: nextIndex - 1,
                            shouldRenderBlock,
                            key : showAdded ? key : '',
                            value : showAdded ? value : '',
                            currentPath,
                            state: STATE.ADDED,
                            level
                        });
                    case 2:
                        const NewBlock = renderBlockOrLine({
                            index: nextIndex - 1,
                            shouldRenderBlock,
                            key: showAdded ? key : '_',
                            value: showAdded ? keyDelta[0] : '_',
                            currentPath,
                            state: STATE.ADDED,
                            level
                        });
                        const OldBlock = renderBlockOrLine({
                            index: nextIndex - 1,
                            shouldRenderBlock,
                            key: showRemoved ? key : '_',
                            value: showRemoved ? keyDelta[1] : '_',
                            currentPath,
                            state: STATE.REMOVED,
                            level
                        });
                        return (
                            <>
                                {NewBlock}
                                {OldBlock}
                            </>
                        );
                    case 3:
                        return renderBlockOrLine({
                            index: nextIndex - 1,
                            shouldRenderBlock,
                            key : showRemoved ? key : '',
                            value : showRemoved ? value : '',
                            currentPath,
                            state: STATE.REMOVED,
                            level
                        });
                }
            }

            return renderBlockOrLine({
                index: nextIndex - 1,
                shouldRenderBlock,
                key : showRemoved ? key : '',
                value : showRemoved ? value : '',
                currentPath,
                state: STATE.HAS_UPDATE,
                level
            });
        })
    }

    const openingBracket = Array.isArray(blockValue) ? '[' : '{';
    const closingBracket = Array.isArray(blockValue) ? ']' : '}';

    if (_isNull(blockValue)) return <JsonLine lineKey={blockKey} lineValue={'null'} state={state} level={level-1}/>
    if (!(Array.isArray(blockValue) || typeof blockValue === 'object')) {
        return <JsonLine lineKey={blockKey} lineValue={blockValue} state={state} level={level}/>
    }
    if (!isBlockExpanded) return <JsonLine lineKey={blockKey} lineValue={`${openingBracket} ${_size(blockValue)} items ${closingBracket}`} setIsExpanded={() => {setIsBlockExpanded((expanded) => !expanded)}} canExpand={_size(blockValue) > 0} state={state} level={level-1} />

    return (
        <div>
            <JsonLine lineKey={blockKey} lineValue={openingBracket} canExpand={!_isEmpty(blockValue)} isExpanded={isBlockExpanded} setIsExpanded={() => { setIsBlockExpanded((expanded) => !expanded)}} canCopyValue={true} level={level-1} state={state !== STATE.HAS_UPDATE ? state : undefined}/>
            { renderBlockLines() }
            <JsonLine lineKey={''} lineValue={closingBracket} level={level-1} state={state !== STATE.HAS_UPDATE ? state : undefined}/>
        </div>
    );
};

export default JsonBlock;
