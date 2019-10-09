import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import {dj, getNodesInShortestPathOrder} from '../src/algorithms/dj';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import {Col,Row} from "react-bootstrap";
import './triangletwo-right.svg';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;



export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }




    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dj(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <head>
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                        crossOrigin="anonymous"
                    />

                </head>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="#home">Pathfinding Visualizer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#dj"><div onClick={() => this.visualizeDijkstra()}>Dijikstra</div></Nav.Link>
                            <Nav.Link href="#link">Depth-First Search (COMING SOON!)</Nav.Link>
                            <Nav.Link href="#link">Breadth-First Search (COMING SOON!)</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Container >

                    <Row>
                        <ul>
                            <li>
                                <div className="start">
                                    StartNode
                                </div>
                            </li>
                            <li>
                                <div className="target"></div>
                                Target Node
                            </li>
                            <li>
                                <div className="unvisited"></div>
                                Unvisited Node
                            </li>
                            <li>
                                <div className="visited"></div>
                                <div className="visitedobject"></div>
                                Visited Nodes
                            </li>
                            <li>
                                <div className="shortest-path"></div>
                                Shortest-path Node
                            </li>
                            <li>
                                <div className="wall"></div>
                                Wall Node
                            </li>
                        </ul>
                    </Row>

                    <Row>
                        <Col>
                            <div className="grid" style={{margin: '0 0 0'}}>
                                {grid.map((row, rowIdx) => {
                                    return (
                                        <div key={rowIdx}>
                                            {row.map((node, nodeIdx) => {
                                                const {row, col, isFinish, isStart, isWall} = node;
                                                return (
                                                    <Node
                                                        key={nodeIdx}
                                                        col={col}
                                                        isFinish={isFinish}
                                                        isStart={isStart}
                                                        isWall={isWall}
                                                        mouseIsPressed={mouseIsPressed}
                                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                        onMouseEnter={(row, col) =>
                                                            this.handleMouseEnter(row, col)
                                                        }
                                                        onMouseUp={() => this.handleMouseUp()}
                                                        row={row}></Node>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 42; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};