import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from 'react';
import styles from "../../styles/Home.module.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";


const { BLOG_URL, CONTENT_API_KEY } = process.env;

async function getPost(slug: string) {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html,feature_image,reading_time,created_at,updated_at&include=authors,tags`
  ).then((res) => res.json());
  const posts = res.posts;

  return posts[0];
}

export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);
  return {
    props: { post },
    revalidate: 10,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

type Post = {
  title: string;
  html: string;
  slug: string;
  feature_image: string;
  reading_time: number;
  created_at: string;
  updated_at: string;
};

const Post: React.FC<{ post: Post }> = (props) => {
  const { post } = props;
  const [enableLoadComments, setEnabledLoadComments] = useState<boolean>(true);

  const router = useRouter();

  if (router.isFallback) {
    return <h1 className={styles.container}>Loading...</h1>;
  }

  function loadComments() {
    setEnabledLoadComments(false)
      ;(window as any).disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = post.slug;
    };

    const script = document.createElement("script");
    script.src = "https://studiogenix-blog.disqus.com/embed.js";
    script.setAttribute("data-timestamp", Date.now().toString());

    document.body.appendChild(script);
  }

  return (
    <>
      <header className="header_area">
        <div className="top-header">
          <div className="container">
            <div className="row align-items-center top-header-inner">
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="top-social-info">
                    <a
                      href="https://github.com/Kola92"
                      className="github-hover"
                      target="_blank"
                    >
                      <i className="ti-github"></i>
                    </a>
                    <a
                      href="https://twitter.com/olawale_adekola"
                      className="twitter-hover"
                      target="_blank"
                    >
                      <i className="ti-twitter"></i>
                    </a>
                    <a
                      href="https://www.instagram.com/kola.dev/"
                      className="instagram-hover"
                      target="_blank"
                    >
                      <i className="ti-instagram"></i>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/adekola-olawale-9287b1133/"
                      className="linkedin-hover"
                      target="_blank"
                    >
                      <i className="ti-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main_menu">
          <Navbar bg="white" className="header-nav" expand="lg">
            <Container>
              <Navbar.Brand
                className="logo_h"
                href="https://studiogenix.netlify.app/"
              >
                <Image
                  src="/logo3.png"
                  alt="Logo"
                  width="114"
                  height="40"
                  quality="100"
                  unoptimized={true}
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarSupportedContent">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  <Nav.Link href="https://studiogenix.netlify.app/">
                    Home
                  </Nav.Link>
                  <Nav.Link href="https://studiogenix.netlify.app/about">
                    About
                  </Nav.Link>
                  <Nav.Link href="https://studiogenix.netlify.app/portfolio">
                    Portfolio
                  </Nav.Link>

                  <NavDropdown title="Services" id="basic-nav-dropdown">
                    <NavDropdown.Item href="https://studiogenix.netlify.app/web">
                      Web
                    </NavDropdown.Item>
                    <NavDropdown.Item href="https://studiogenix.netlify.app/wordpress">
                      Wordpress
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="https://studiogenix.netlify.app/contact">
                    Contact
                  </Nav.Link>
                  <Nav.Link
                    className="active"
                    href="https://studiogenix-blog.vercel.app"
                  >
                    Blog
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </header>
      <div className={styles.container} style={{ marginTop: "10rem" }}>
        <p className={styles.goback}>
          <Link href="/">
            <a>Go Back</a>
          </Link>
        </p>

        <div className="blog_post">
          <h3>{post.title}</h3>
          <div className="meta-data">
            {new Date(post.created_at).toLocaleDateString()} |{" "}
            {post.reading_time} mins read
          </div>
          <div className="feature_img">
            <img src={post.feature_image} alt={post.title} />
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
        </div>

        {enableLoadComments && (
          <p className="display-comments">
            <button onClick={loadComments}>Leave A Comment</button>
          </p>
        )}
        <div id="disqus_thread" className={styles.disqus}></div>
      </div>

      <footer className="footer_area">
        <div className="footer-main">
          <div className="container footer_container">
            <div className="row footer_row">
              <div className="col-sm-12" style={{ padding: "0" }}>
                <div className="heading-title-wrapper" id="quote">
                  <h2 className="title">
                    Get <span className="white-text">in touch</span>
                  </h2>
                  <span
                    className="line-title"
                    style={{ backgroundColor: "white" }}
                  ></span>
                  <span id="contact" className="sub-title">
                    Got a project in mind? Reach out
                  </span>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="list-contact-wrapper">
                      <div>
                        <div className="contact-wrapper">
                          <span className="icon">
                            <i className="ti-envelope"></i>
                          </span>
                          <span className="mail">
                            <a href="mailto:rolawale92@gmail.com">
                              rolawale92@gmail.com
                            </a>
                          </span>
                        </div>
                        <div className="contact-wrapper">
                          <span className="icon">
                            <i className="ti-mobile"></i>
                          </span>
                          <span>
                            <a href="tel:090302223222">+234-9030223222</a>
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="social-footer">
                      <li>
                        <a
                          className="github-hover"
                          href="https://github.com/Kola92"
                          target="_blank"
                        >
                          <i className="ti-github"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          className="twitter-hover"
                          href="https://twitter.com/olawale_adekola"
                          target="_blank"
                        >
                          <i className="ti-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          className="instagram-hover"
                          href="https://www.instagram.com/kola.dev/"
                          target="_blank"
                        >
                          <i className="ti-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          className="linkedin-hover"
                          href="https://www.linkedin.com/in/adekola-olawale/"
                          target="_blank"
                        >
                          <i className="ti-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-12 col-md-6" style={{ padding: "0" }}>
                    <div className="contact-form-wrapper">
                      <div className="gf-wrapper">
                        <form action="post">
                          <div className="gf-body">
                            <ul className="gform-fields top-label form-sublabel-below description-below">
                              <li className="gfield gfield-contains-required">
                                <label
                                  htmlFor="details"
                                  className="gfield-label"
                                >
                                  Tell us about your project
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-textarea">
                                  <textarea
                                    name=""
                                    id="details"
                                    cols={50}
                                    rows={10}
                                    className="textarea large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  ></textarea>
                                </div>
                              </li>
                              <li className="gfield gfield-contains-required">
                                <label htmlFor="name" className="gfield-label">
                                  Full Name
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-text">
                                  <input
                                    type="text"
                                    name=""
                                    id="name"
                                    className="large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  />
                                </div>
                              </li>
                              <li className="gfield gfield-contains-required">
                                <label htmlFor="email" className="gfield-label">
                                  Company/Organization
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-company">
                                  <input
                                    type="text"
                                    name=""
                                    id="email"
                                    className="large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  />
                                </div>
                              </li>
                              <li className="gfield gfield-contains-required">
                                <label htmlFor="email" className="gfield-label">
                                  Budget
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-company">
                                  <input
                                    type="text"
                                    name=""
                                    id="email"
                                    className="large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  />
                                </div>
                              </li>
                              <li className="gfield gfield-contains-required">
                                <label htmlFor="email" className="gfield-label">
                                  Deadline
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-company">
                                  <input
                                    type="text"
                                    name=""
                                    id="email"
                                    className="large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  />
                                </div>
                              </li>
                              <li className="gfield">
                                <label htmlFor="email" className="gfield-label">
                                  Email
                                  <span className="gfield-required">*</span>
                                </label>
                                <div className="ginput-container ginput-container-email">
                                  <input
                                    type="text"
                                    name=""
                                    id="email"
                                    className="large"
                                    aria-required="true"
                                    aria-invalid="false"
                                  />
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="gform-footer top-label">
                            <input
                              type="submit"
                              value="Let's Talk"
                              id="gform-submit"
                              className="gform-button button"
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-12">
              <div className="footer_top flex-column">
                <div className="footer_logo">
                  <a href="http://studiogenix.netlify.app/">
                    <Image
                      src="/logo3.png"
                      alt="Logo"
                      width="114"
                      height="40"
                      quality="100"
                      unoptimized={true}
                    />
                  </a>
                  <div className="d-lg-block d-none">
                    <nav className="navbar navbar-expand-lg navbar-light nav-footer justify-content-center">
                      <div className="collapse navbar-collapse offset">
                        <ul className="nav navbar-nav menu_nav mx-auto">
                          <li className="nav-item">
                            <a
                              className="nav-link text-white"
                              href="https://studiogenix.netlify.app/"
                            >
                              Home
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link text-white"
                              href="https://studiogenix.netlify.app/about"
                            >
                              About
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link text-white"
                              href="https://studiogenix.netlify.app/portfolio"
                            >
                              Portfolio
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link text-white"
                              href="https://studiogenix.netlify.app/contact"
                            >
                              Contact
                            </a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row footer_bottom justify-content-center text-center">
            <p className="col-lg-8 col-sm-12 footer-text">
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script>
              StudiogeniX Agency | All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Post;
