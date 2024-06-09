import React from 'react';
import '../../../cards/listCard.css';
import Cards from './Cards';

export default function AllListCard({ type, data }) {

  const getName = (type) => {
    switch (type) {
      case 'eventsTodo':
        return '活動待辦事項';
      case 'onlineorders':
        return '網路訂單';
      case 'physicalorders':
        return '實體訂單';
      case 'restockandrefund':
        return '進退貨';
      case 'sinica':
        return '四分溪';
      default:
        return 'None';
    }
  };

  const Category = getName(type);

  return (
    <div >
      <h2 style={{textAlign:'center'}}>{Category}</h2>
      <div>
        <div className='allCardCss'>
          {data.length === 0 ? (
            <p>Loading...</p>
          ) : (
            data.map((item) => (
              <Cards key={item.id} data={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
