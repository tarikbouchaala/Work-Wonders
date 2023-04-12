import { HashLoader } from 'react-spinners'

export default function Loading() {
    return (
        <div className="loading-spinner">
            <HashLoader
                color="#feab5e"
                size={100}
                speedMultiplier={1.5}
            />
        </div>
    )
}
