import React, { useState } from "react";
import { connect } from "react-redux";
import { Container, Grid, Fab } from "@material-ui/core";
import { green, blueGrey } from "@material-ui/core/colors";
import styled from "styled-components";

import { GAME_STATES } from "../selectors/enums";
import {
  gameStateStateSelector,
  hasManualBotSelector,
} from "selectors/gameState";
import * as ws from "../websockets";

import { H3, H5 } from "components/styledComponents";
import { ConfirmDialogStartWithBotsOffline } from "components/confirmDialogStartWithBotsOffline";
import { ConfirmDialogEndGame } from "components/confirmDialogEndGame";

/*
  Things the human referee most urgently needs to do:
  - Start Game
  - When Game is running:
    - Pause Game
  - When Game is Paused:
    - Reset to Home Positions
    - Resume Game
    - Quit Game (reset clock)

  Things human needs needs to see:
  - gameState.gameStatus.state
  - gameState.gameStatus.secondsRemaining
  - Where positioning system thinks bots are at
    imposed on a graphical playing field
  - Confirmation that bots are online

*/
const GameControls = ({ gameStateState, hasManualBot }) => {
  const [isConfirmingStart, setIsConfirmingStart] = useState(false);
  const [isConfirmingEnd, setIsConfirmingEnd] = useState(false);

  const handleGameOnButton = () => {
    if (hasManualBot) {
      setIsConfirmingStart(true);
    } else {
      ws.sendGameStart();
    }
  };

  const handleConfirmStartAsIs = () => {
    setIsConfirmingStart(false);
    ws.sendGameStart();
  };

  const handleConfirmSwitchToAuto = () => {
    setIsConfirmingStart(false);
    ws.sendAllBotsToAuto();
    ws.sendGameStart();
  };

  const handleGameStopButton = () => {
    setIsConfirmingEnd(true);
  };

  const handleConfirmGameStop = () => {
    setIsConfirmingEnd(false);
    ws.sendGameStop();
  };

  const GameOnButton = () => (
    <GridItem>
      <BigAssButton onClick={handleGameOnButton}>
        <H3>Game On!</H3>
      </BigAssButton>
    </GridItem>
  );

  const PauseButton = () => (
    <GridItem>
      <BigAssButton onClick={() => ws.sendGamePause()}>
        <H3>Pause Game</H3>
      </BigAssButton>
    </GridItem>
  );

  const ResumeButton = () => (
    <GridItem>
      <BigAssButton onClick={() => ws.sendGameResume()}>
        <H3>Resume Game</H3>
      </BigAssButton>
    </GridItem>
  );

  const ReturnToHomeButton = () => (
    <GridItem>
      <LesserButton onClick={() => ws.sendReturnToHome()}>
        <H5>Return to Home</H5>
      </LesserButton>
    </GridItem>
  );

  const EndGameButton = () => (
    <GridItem>
      <LesserButton onClick={handleGameStopButton}>
        <H5>End Game</H5>
      </LesserButton>
    </GridItem>
  );

  const Buttons = () => {
    const buttons = [];
    switch (gameStateState) {
      case GAME_STATES.game_over:
        buttons.push(<GameOnButton />);
        break;
      case GAME_STATES.game_on:
        buttons.push(<PauseButton />);
        break;
      case GAME_STATES.game_paused:
        buttons.push(<ReturnToHomeButton />);
        buttons.push(<ResumeButton />);
        buttons.push(<EndGameButton />);
        break;
      case GAME_STATES.return_home:
        buttons.push(<PauseButton />);
        break;
      default:
        return null;
    }
    return buttons;
  };

  return (
    <OurContainer>
      <Grid container spacing={2} align="center" justify="center">
        <Buttons />
      </Grid>
      <ConfirmDialogStartWithBotsOffline
        isOpen={isConfirmingStart}
        onCancel={() => setIsConfirmingStart(false)}
        onConfirmAsIs={handleConfirmStartAsIs}
        onConfirmSwitchToAuto={handleConfirmSwitchToAuto}
      />
      <ConfirmDialogEndGame
        isOpen={isConfirmingEnd}
        onCancel={() => setIsConfirmingEnd(false)}
        onConfirm={handleConfirmGameStop}
      />
    </OurContainer>
  );
};

const OurContainer = styled(Container)`
  margin-top: 20px;
  margin-bottom: 20px;
  min-height: 70px;
`;

const GridItem = styled(Grid).attrs((props) => ({
  item: true,
  ...props,
}))`
  align-self: center;
`;

const BigAssButton = styled(Fab).attrs((props) => ({
  size: "large",
  variant: "extended",
  ...props,
}))`
  background-color: ${green["A400"]};
  margin-right: 20px;
  padding: 22px;
`;

const LesserButton = styled(Fab).attrs((props) => ({
  size: "medium",
  variant: "extended",
  ...props,
}))`
  background-color: ${blueGrey["100"]};
  margin-right: 20px;
  padding: 12px;
  width: 100px;
`;

const mapStateToProps = (state) => ({
  gameStateState: gameStateStateSelector(state),
  hasManualBot: hasManualBotSelector(state),
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(GameControls);