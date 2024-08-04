
import bordergood from '@/assets/border/khungdong.webp';
import bordergoodtop from '@/assets/border/khungbac.webp';
import borderbest from '@/assets/border/khungvang.webp';
const BorderRank = ({children, role, size=180}) => {
    const border = {
        'good': bordergood,
        'best': borderbest,
        'top-good': bordergoodtop
    }
    return (
        <div className='flex items-center justify-center relative'>
            <div className='flex items-center justify-center'
                style={{width: size + 'px', height: size + 'px'}}
            >
                {
                    border[role] && <img src={border[role]} alt="border" className='w-full h-full object-contain' />
                }
                {children}
            </div>
        </div>
    )
}


export default BorderRank

