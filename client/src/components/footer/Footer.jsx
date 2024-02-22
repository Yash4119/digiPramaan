import './footer.scss';
export default function Footer(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return(
        <div className="footer">
            <div className="links">
                <span>Home</span>
                <span>Contact Us</span>
                <span>About Us</span>
            </div>
            <div className="copyright">
                ©Copyright {currentYear} 
            </div>
        </div>
    )
}