import { Fragment } from "react";

function ListGroup() {
  let items = ["New York", "San Francisco", "Seoul", "London", "Paris"];

  const message = items.length === 0 ? <p>no item found</p> : null;

  return (
    <Fragment>
      <h1>List</h1>
      {message}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className="list-group-item"
            key={item}
            onClick={() => console.log(item, index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;
