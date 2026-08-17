import { Cell, Pie, PieChart, Legend, Tooltip } from 'recharts';
import { Skeleton } from '../../ui/Skeleton/Skeleton';

export function MyPieChart({data, colors, title, isLoading }){

    const COLORS = colors; 
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
            return null;
        }
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const ncx = Number(cx);
        const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const ncy = Number(cy);
        const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
                {`${((percent ?? 1) * 100).toFixed(0)}%`}
            </text>
        );
    };

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
                        <PieChart style={{ width: '100%', maxWidth: '300px', margin: '0 auto', maxHeight: '70vh', aspectRatio: 1 }} responsive>
                            <Pie
                                data={data}
                                labelLine={false}
                                label={renderCustomizedLabel}
                                fill="#005DAC"
                                dataKey="value"
                                isAnimationActive={true}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" />

                        </PieChart>
                )
            }
            

           
        </div>
    )

}