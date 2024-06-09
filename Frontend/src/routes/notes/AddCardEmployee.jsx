import React from 'react'
import './Card.css'
// import data from './data'

export default function CardEmployee() {
    return (
        <div class="wrapcard">
            <h2>*****員工*****</h2>
            <div class="card">
                <div class="container">
                    <h4><b>Job 1</b></h4>
                    <p>...</p>
                </div>
            </div>
            <div class="card">
                <div class="container">
                    <h4><b>Job 2</b></h4>
                    <p>...</p>
                </div>
            </div>
            <div class="card">
                <div class="container">
                    <h4><b>Job 3</b></h4>
                    <p>...</p>
                </div>
            </div>
            <button class='cardButton'>Add</button>
        </div>
    );
}
