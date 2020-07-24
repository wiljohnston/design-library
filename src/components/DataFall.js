import React, { useRef, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { identity } from "underscore";
import { DocumentContext } from "~context/DocumentContext";
import { CursorContext } from "~context/CursorContext";

const DataFall = ({ className, fontClass, char, children }) => {
  const { windowWidth } = useContext(DocumentContext);
  const { cursorPositionX, cursorPositionY } = useContext(CursorContext);

  const containerRef = useRef();
  const rulerRef = useRef();
  const heightRulerRef = useRef();

  const [containerWidth, setContainerWidth] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [containerOffsetTop, setContainerOffsetTop] = useState(null);
  const [containerOffsetLeft, setContainerOffsetLeft] = useState(null);

  const [rulerWidth, setRulerWidth] = useState(null);
  const [rulerHeight, setRulerHeight] = useState(null);
  const [charWidth, setCharWidth] = useState(null);
  const [charHeight, setCharHeight] = useState(null);
  const [rulerText, setRulerText] = useState(char);
  const [heightRulerText, setHeightRulerText] = useState(`${char}\n`);
  const [matrix, setMatrix] = useState([[]]);

  const buffer = 1;

  //

  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (
          document?.readyState === `ready` ||
          document?.readyState === `complete`
        ) {
          setContainerWidth(
            containerRef?.current?.getBoundingClientRect()?.width
          );
          setContainerHeight(
            containerRef?.current?.getBoundingClientRect()?.height
          );
        }
      });
    }, 300);
  }, [containerRef.current, windowWidth, document?.readyState]);

  //

  useEffect(() => setContainerOffsetTop(containerRef?.current?.offsetTop), [
    containerRef?.current?.offsetTop
  ]);

  //

  useEffect(() => setContainerOffsetLeft(containerRef?.current?.offsetLeft), [
    containerRef?.current?.offsetLeft
  ]);

  //

  useEffect(() => {
    setRulerWidth(rulerRef?.current?.getBoundingClientRect()?.width);
    setCharHeight(rulerRef?.current?.getBoundingClientRect()?.height);
  }, [rulerRef.current, rulerRef.current?.innerText]);

  //

  useEffect(() => {
    setRulerHeight(heightRulerRef?.current?.getBoundingClientRect()?.height);
    setCharWidth(heightRulerRef?.current?.getBoundingClientRect()?.width);
  }, [heightRulerRef.current, heightRulerRef.current?.innerText]);

  //

  useEffect(() => {
    if (rulerWidth && charWidth && rulerHeight && charHeight) {
      if (Math.floor(rulerWidth + buffer * charWidth) <= containerWidth) {
        setRulerText(`${rulerText}${char}`);
      } else if (Math.floor(rulerWidth - buffer * charWidth) > containerWidth) {
        setRulerText(rulerText.substring(0, rulerText.length - 1));
      }

      if (Math.floor(rulerHeight + buffer * charHeight) <= containerHeight) {
        setHeightRulerText(`${heightRulerText}${char}\n`);
      } else if (
        Math.floor(rulerHeight - buffer * charHeight) > containerHeight
      ) {
        setHeightRulerText(
          heightRulerText.substring(0, heightRulerText.length - 2)
        );
      }
    }
  }, [rulerText, heightRulerText, charWidth, containerWidth, containerHeight]);

  //

  useEffect(() => {
    requestAnimationFrame(() => {
      setMatrix(
        new Array(Math.floor(heightRulerText.length / 2)).fill(
          new Array(rulerText.length).fill(char)
        )
      );
    });
  }, [heightRulerText, rulerText]);

  //

  const rawRelativePositon = {
    x: cursorPositionX - containerOffsetLeft,
    y: cursorPositionY - containerOffsetTop
  };

  const cursorMatrixIndex = {
    x:
      rawRelativePositon.x >= 0 &&
      rawRelativePositon.x <= Math.ceil(containerWidth)
        ? Math.floor((rawRelativePositon.x / containerWidth) * rulerText.length)
        : null,
    y:
      rawRelativePositon.y >= 0 &&
      rawRelativePositon.y <= Math.ceil(containerHeight)
        ? // eslint-disable-next-line prettier/prettier
        Math.floor((rawRelativePositon.y / containerHeight) * heightRulerText.length / 2)
        : null
  };

  console.log(cursorMatrixIndex);

  const getCellStyle = (rowIndex, colIndex, cursorColIndex, cursorRowIndex) => {
    if (
      cursorColIndex &&
      cursorRowIndex &&
      colIndex - 5 < cursorColIndex < colIndex + 5 &&
      rowIndex - 3 < cursorRowIndex < rowIndex + 3
    ) {
      return `opacity-25`;
    }
    return ``;
  };

  return (
    <div
      className={`${className ||
        `w-full h-full block cursor-pointer`} ${fontClass}`}
      style={{ position: `relative` }}
      ref={containerRef}
    >
      <span
        className="absolute top-0 left-0 whitespace-no-wrap opacity-0"
        ref={rulerRef}
      >
        {rulerText}
      </span>

      <span
        className=" absolute top-0 right-0 whitespace-pre-line opacity-0"
        ref={heightRulerRef}
      >
        {heightRulerText}
      </span>

      <ul className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center whitespace-pre-line">
        {matrix.map((row, rowIndex) => {
          const { x, y } = cursorMatrixIndex;
          const rowKey = `row_${rowIndex}`;
          return (
            <li key={rowKey}>
              {row.map((cell, colIndex) => {
                const cellKey = `cell_${rowIndex}_${colIndex}`;
                return (
                  <span
                    className={`transition-opacity--fast ${getCellStyle(
                      rowIndex,
                      colIndex,
                      x,
                      y
                    )}`}
                    key={cellKey}
                  >
                    {cell}
                  </span>
                );
              })}
            </li>
          );
        })}
      </ul>

      {children && children}

      {/* <div className="absolute transform-center bg-white p-4 shadow-2xl">
        Width: {rulerText.length}
        <br />
        Height: {heightRulerText.length / 2}
      </div> */}
    </div>
  );
};

DataFall.defaultProps = {
  className: ``,
  char: `0`,
  fontClass: `font-mono`,
  children: null
};

DataFall.propTypes = {
  className: PropTypes.string,
  char: PropTypes.string,
  fontClass: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default DataFall;
