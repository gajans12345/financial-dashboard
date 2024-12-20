import React from 'react';
import { FaMicrosoft } from "react-icons/fa";


export function MicrosoftMain(){
    return (
      <div className = "big">
          <div className = "top"> 
             <div className = "title"> 
             <MicrosoftHeader></MicrosoftHeader >
             </div>
            <div className = "mid">
              <Statty></Statty>
            </div>
            <div className = "edge"> 
              <Statty></Statty>
            </div>
        
          </div>

        <div className = "bottom"> 
            <div className = "t1"> 
              <Statti></Statti>
            </div>
            <div className = "t2"> 
            <Statti></Statti>
            </div>
            <div className = "t3">
            <Statti></Statti>
            </div>
            <div className = "t4">
            <Statti></Statti>
            </div>
        
        </div>

      </div>
        
      
        

    );

    

}

function MicrosoftHeader(){
    return (
        <div className="stock-container">
      <h1 className="stock-title">Stock Details</h1>
      <div className="stock-card">
        <div className="stock-header">
            <h2 className="stock-name">Microsoft</h2>
            <h2 className = "stock-logo"><FaMicrosoft /></h2>
       </div>
            <span className="stock-symbol">MSFT</span>
            <span className = "blurb"> Microsoft Corporation, founded in 1975 by Bill Gates and Paul Allen, is a global leader in software, services, and technology solutions. </span>
        
        
        
      </div>
    </div>
    );
}

function Statty(name,value){

  return(
    <div className = "stock-stats"></div>


  );
}

function Statti(name,value){

  return(
    <div className = "sc"></div>


  );
}