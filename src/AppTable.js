//my own Table component
import './custom_css/Table.css'
import React from "react";

export function AppTable(props){

    return (
        <div>
            <br></br>
            <table>
                <thead>
                    <tr>
                    {props.columns.map((item, i)=>{
                        return(
                        <th key={i}>{item.Header}</th>
                        )
                    })}
                    </tr>
                </thead>
                <tbody>
                {props.rows.map((row, i)=>{
                    return(
                        <tr key={i}>
                            <td>{row.app_ID}</td>
                            <td>{row.app_name}</td>
                            <td>{row.description}</td>
                            <td>
                                <button type="button" className='typeA' onClick={()=>props.handleA(row)}>EDIT</button>
                                <button type="button" className='typeB' onClick={()=>props.handleB(row)}>DELETE</button>                               
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}