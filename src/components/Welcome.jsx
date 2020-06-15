import React from "react";
import { connect } from "react-redux";
import { startGame } from "../store/game";
import "./Welcome.css";

const Welcome = (props) => {
  const { gameStarted, startGame } = props;

  if (gameStarted) {
    return null;
  }

  return (
    <div className="welcome">
      <div className="welcome-content card">
        <div className="row">
          <div className="col-4">
            <img src="/images/checklist.png" className="img-fluid" alt="Customer" />
          </div>
          <div className="col-8">
            <div className="card-body">
              <p>
                Hi, I'm Dave. Welcome to the Traveling Salesman game! In this game, you will travel with me across
                Europe to get our latest product, the <strong>ultimate random thing</strong> to the customers. In one week, we
                will be hopping jets, sleeping in hotels, landing deals along the way like true road warriors!
              </p>
              <p>
                For starter, we have $10000 in cash. We make more money from successful deals. Customers will appear
                randomly across Europe, and we must get there before they lose interest! But be careful not to stress
                ourselves too much, because the game will end if we cannot move anymore!
              </p>
              <button className="btn btn-primary" onClick={startGame}>
                Let's go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ game: { gameStarted } }) => ({ gameStarted }), { startGame })(Welcome);
