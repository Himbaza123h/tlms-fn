import React from 'react';
import { 
  LinkedinIcon, 
  GithubIcon, 
  InstagramIcon,
} from 'lucide-react';
import styles from '../../styles/components/Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.column}>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#team">Our Team</a></li>
                        <li><a href="#careers">Careers</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>Solutions</h4>
                    <ul>
                        <li><a href="#Products">Products Distribution</a></li>
                        <li><a href="#Inter-warehouse">Inter-warehouse Transport</a></li>
                        <li><a href="#On-demand">On-demand Transport</a></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:himbazaalain022@gmail.com">himbazaalain022@gmail.com</a></li>
                        <li><a href="tel:+250782179022">+250 782 179 022</a></li>
                        <li><a href="#chat">Live Support</a></li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <div className={styles.socialIcons}>
                    <a href="https://www.linkedin.com/in/alainhonore/" aria-label="LinkedIn"><LinkedinIcon /></a>
                    <a href="https://github.com/Himbaza123h" aria-label="GitHub"><GithubIcon /></a>
                    <a href="https://www.instagram.com/alain_honore1_official/" aria-label="Instagram"><InstagramIcon /></a>
                </div>
                <div className={styles.links}>
                    &copy; {new Date().getFullYear()} Alain Honore. All rights reserved.
                    <br />
                </div>
            </div>
        </footer>
    );
};

export default Footer;