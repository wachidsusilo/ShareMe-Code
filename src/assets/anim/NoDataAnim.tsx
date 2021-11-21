import './NoDataAnim.scss'
import asset1 from './images/asset_1.png'
import asset2 from './images/asset_2.png'
import asset3 from './images/asset_3.png'
import asset4 from './images/asset_4.png'
import asset5 from './images/asset_5.png'

function NoDataAnim() {
    return (
        <div className='no-data-anim'>
            <img className='no-data-anim-3' alt='' src={asset3} />
            <img className='no-data-anim-5' alt='' src={asset5} />
            <img className='no-data-anim-1' alt='' src={asset1} />
            <img className='no-data-anim-2' alt='' src={asset2} />
            <img className='no-data-anim-4' alt='' src={asset4} />
        </div>
    )
}

export default NoDataAnim
