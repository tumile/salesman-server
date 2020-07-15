import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { startGame } from "../state/game";
import "./Modal.css";

const Welcome = (props) => {
  const { gameStarted } = props;

  if (gameStarted) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content card">
        <div className="row">
          <div className="col-4 text-center">
            <img src="/images/player/checklist.png" alt="Customer" />
          </div>
          <div className="col-8">
            <div className="card-body">
              <p>
                Hi, I&lsquo;m Dave. Welcome to the Traveling Salesman game! In this game, you will travel with me across
                Europe to get our latest product, the
                <strong> ultimate random thing </strong>
                to the customers. In one week, we will be hopping jets, sleeping in hotels, landing deals along the way
                like true road warriors!
              </p>
              <p>
                For starter, we have $10000 in cash. We make more money from successful deals. Customers will appear
                randomly across Europe, and we must get there before they lose interest! But be careful not to stress
                ourselves too much, because the game will end if we cannot move anymore!
              </p>
              <button type="button" className="btn btn-primary" onClick={() => props.startGame()}>
                Let&lsquo;s go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Welcome.propTypes = {
  gameStarted: PropTypes.bool.isRequired,
  startGame: PropTypes.func.isRequired,
};

export default connect(({ gameStarted }) => ({ gameStarted }), { startGame })(Welcome);
