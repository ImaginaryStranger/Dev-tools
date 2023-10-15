import JsonBlock from "./JsonBlock.jsx";
import {STATE} from "./jsonDiff.constants.js";

const JsonViewer = props => {
    const { json, delta, showAdded, showRemoved, limitedMode } = props;
    return (
           <div style={{ margin: 'px', background: '#000000', border: '3px solid black'}}>
               <JsonBlock
                   index={0}
                   blockKey={''}
                   blockValue={json}
                   delta={delta}
                   path={''}
                   state={STATE.HAS_UPDATE}
                   level={2}
                   showAdded={showAdded}
                   showRemoved={showRemoved}
                   limitedMode={limitedMode}
               />
           </div>
    );
};

export default JsonViewer;
