import React from "react";

const EvaluatedAnswers = ({ calculations }) => {
  return (
    <div className="calculated-result">
      {calculations.map((calculation) => {
        return (
          <>
            <div className="evaluation">
              <div className="evaluated-ans">
                {!Number.isNaN(calculation.evaluatedAns) ? (
                  <p className="valid">{`Ans for node starting at ${calculation.startNode} and Ending at ${calculation.endNode} is : ${calculation.evaluatedAns} `}</p>
                ) : (
                  <p className="invalid">{`Expression for node starting at ${calculation.startNode} and Ending at ${calculation.endNode} is : INVALID `}</p>
                )}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default EvaluatedAnswers;
