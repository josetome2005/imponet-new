import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../../ui/Skeleton/Skeleton';

export function MyBarChart({data, title, xAxisTitle, yAxisTitle, isLoading}){

    
    return(
        <div className="dashboard__module dashboard__module--chart">

            <h3 className='chart__title'>{title}</h3>

            {isLoading ? (
                <Skeleton
                    width="100%"
                    height={320}
                    radius="12px"
                    style={{ maxWidth: '700px', display: 'block' }}
                />
            ) : (
                <BarChart
                    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                    responsive
                    data={data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisTitle} />
                    <YAxis width="auto" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={yAxisTitle} fill="#005DAC" radius={[8, 8, 0, 0]} activeBar={<Rectangle fill="#005dac" />} />
                </BarChart>
            )}

            
        </div>
    )

}