
import React, { useState } from "react";
import { ResponsivePie } from '@nivo/pie'
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
const axios = require("axios");


const PieChart = () => 
{ 
    const  [{ loading, data, err}, setState ] = useState({ loading: true, data: null, err: null});

    if(loading)
    {
        axios.get("http://127.0.0.1:3001/pacientes")
        .then(
           res=>
           {    
               let {result} = res.data;

            //    console.info(result);

               setState({ data: result, loading: false, err: null });
           }
         )
        .catch( 
            err =>
            {
               setState({ data: null, loading: false, err });
            });

        return (
            <CircularProgress/>
        )
    }
    else if(err)
    {
        return (
            <Alert severity="error">
                {
                    JSON.stringify(err)
                }
            </Alert>
        )
    }

    return ( <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#333333"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#333333"
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />
        )
    }

    export default PieChart;