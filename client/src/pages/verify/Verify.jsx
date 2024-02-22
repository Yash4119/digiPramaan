import { useState, useRef, useEffect } from "react";
import "./verify.scss";
export default function Verify() {
  const [hashAsInput, setInput] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("VERIFY");
  const inputRef = useRef(null);
  const headingRef = useRef(null);
  let isCertificateValid = false;
  useEffect(() => {
    if (hashAsInput) {
      // Access the current property of the ref to get the input element
      const inputElement = inputRef.current; // Check if the input element exists before focusing
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [hashAsInput]);

  function initiateVerification() {
    //Make call
    setVerificationStatus("VERIFYING");
    setTimeout(() => {
      isCertificateValid
        ? // Do something with the current value, for example, update the state
          setVerificationStatus("VALID")
        : setVerificationStatus("INVALID");
    }, 1000); // 10 seconds timeout
  }
  useEffect(() => {
    if (verificationStatus == "VERIFYING") {
      headingRef.current.innerHTML = "Verifying . . .";
    } else if (verificationStatus == "VALID") {
      headingRef.current.innerHTML = "Valid.";
    } else if (verificationStatus == "INVALID") {
      headingRef.current.innerHTML = "Invalid.";
    }
  }, [verificationStatus]);
  return (
    <div className="verify page">
      <div className="heading">
        <span ref={headingRef}>Verify.</span>
      </div>
      {verificationStatus == "VERIFY" ? (
        <div className="button-wrapper">
          <button className="cta">Upload PDF</button>
          {hashAsInput ? (
            <input ref={inputRef} type="text" className="cta input" />
          ) : (
            <button
              className="cta"
              onClick={() => {
                setInput((prev) => !prev);
              }}
            >
              Enter Hash
            </button>
          )}
          <button className="continue cta" onClick={initiateVerification}>
            Continue {">>>"}
          </button>
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "VERIFYING" ? (
        <div className="verifying-image">
          <img src="images/verifying.webp" alt="" />
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "VALID" ? (
        <div class="tick-container">
          <img className="result-img" src="images/tick.gif" alt="" />
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "INVALID" ? (
        <div class="cross-container">
          <img className="result-img" src="images/cross.gif" alt="" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
