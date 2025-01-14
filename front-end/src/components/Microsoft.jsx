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
              <Statty name = "Stock Price"></Statty>
            </div>
            <div className = "edge"> 
              <Statty name = "Dividend Rate"></Statty>
            </div>
        
          </div>

        <div className = "bottom"> 
            <div className = "t1"> 
              <Statti name = "Bid-Ask Spread"></Statti>
            </div>
            <div className = "t2"> 
            <Statti name = "52 Week High"></Statti>
            </div>
            <div className = "t3">
            <Statti name = "52 Week Low"></Statti>
            </div>
            <div className = "t4">
            <Statti name = "Peg Ratio"></Statti>
            </div>
        
        </div>

      </div>
        
      
        

    );

    

}

function MicrosoftHeader(){
    return (
        <div className="stock-container">
      <h1 className="stock-title">Microsoft Details</h1>
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

function Statty({name,value}){

  return(
    <div className = "stock-stats"> 
    <h3>{name}</h3>
    

    </div>

  );
}

function Statti({name,value}){

  return(
    <div className = "sc">
      <h3>{name}</h3>
    </div>


  );
}