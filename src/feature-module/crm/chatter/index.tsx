import React, { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import CollapseHeader from '../../../core/common/collapse-header';
import './chatter.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { formats, modules } from '../../../core/data/quill/format';
import PostList from './postList';

const Chatter = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showComment, setShowComment] = useState<number[]>([]);
  const [post, setPost] = useState<{ id?: number; user?: string; content?: string; comments?: { content: string; user: string; }[]; question?: string; }>({ comments: [] });
  const [comment, setComment] = useState<{ user?: string; content?: string; postId?: string; }>({});
  const [posts, setPosts] = useState<{
    id?: number; user?: string; content?: string; question?: string;
    comments?: { content: string; user: string; }[]; choices?: string[]
  }[]>([]);
  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollChoices, setPollChoices] = useState<string[]>(['', '']);
  const { t } = useTranslation();

  const customToast = (type: string, message: string) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
    }
  };

  const handleCreatePost = () => {
    if (post.content) {
      const newPost = {
        id: randomId(),
        user: 'Ngô Quang Trung',
        content: post.content,
        comments: [],
        question: post.question,
      };
      setPosts([...posts, newPost]);
      setPost({});
      setShowPopup(false);
      customToast('success', 'Post created successfully');
    } else {
      customToast('error', 'Post content is empty');
    }
  };

  const handleComment = (id: number | undefined): void => {
    if (comment.content) {
      const newComment = {
        user: 'Ngô Quang Trung',
        content: comment.content,
        postId: id?.toString()
      };
      const newPosts = posts.map((post) => {
        if (post.id === id) {
          post.comments = [...(post.comments ?? []), newComment];
        }
        return post;
      });
      setPosts(newPosts);
      setComment({});
      setShowComment(showComment.filter((showId) => showId !== id));
    }
  };

  const handleShareOption = (option: any) => {
    if (option === 'group') {
      alert('Share with group clicked');
    } else if (option === 'link') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  const handleAddChoice = () => {
    setPollChoices([...pollChoices, '']);
  };

  const handlePollQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPollQuestion(e.target.value);
  };

  const handlePollChoiceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedChoices = [...pollChoices];
    updatedChoices[index] = e.target.value;
    setPollChoices(updatedChoices);
  };

  const handleSubmitPoll = () => {
    const newPoll = {
      id: randomId(),
      user: 'Ngô Quang Trung',
      content: pollQuestion,
      choices: pollChoices.filter(choice => choice !== ''),
      comments: [],
    };
    // You can handle submitting the poll data (newPoll) to your backend or further actions here
    setPosts([...posts, newPoll]);
    customToast('success', 'Poll created successfully');
    setPollQuestion('');
    setPollChoices(['', '']);
  };

  const randomId = () => {
    return Math.floor(Math.random() * 10000);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">{t("LABEL.CHATTER.CHATTER")}</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            {/* Chatter Sidebar */}
            <div className="col-xl-2 theiaStickySidebar">
              <div className="stickybar">
                <div className="contact-sidebar chatter-sidebar">
                  <ul className="set-info">
                    <li>
                      <Link to="#">
                        <i className="ti ti-share-2" />
                        What I Follow
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="ti ti-star" />
                        Bookmarked
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Chatter Sidebar */}
            {/* Chatter Details */}
            <div className="col-xl-10">
              <div className="contact-tab-wrap mb-0">
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#post"
                      className="active"
                    >
                      {t("LABEL.CHATTER.POST")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#question"
                    >
                      {t("LABEL.CHATTER.QUESTION")}
                    </Link>
                  </li>
                  <li>
                    <Link to="#" data-bs-toggle="tab" data-bs-target="#polls">
                      {t("LABEL.CHATTER.POLL")}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Tab Content */}
              <div className="contact-tab-view">
                <div className="tab-content pt-0">
                  {/* POST */}
                  <div className="tab-pane active show" id="post">
                    <div className="post-activity">
                      <div className='row'>
                        {showPopup
                          ?
                          <div className='col-xl-12'>
                            <div className='row'>
                              <ReactQuill
                                modules={modules}
                                formats={formats}
                                placeholder={t("LABEL.CHATTER.POST_PLACE_HOLDER")}
                                onChange={(content) => setPost({ ...post, content })}
                                value={post.content || ''}
                              />
                            </div>
                            <div className='row mt-5 share-btn-wrapper'>
                              <button className='btn btn-light col-xl-2 share-btn' onClick={handleCreatePost}>{t("LABEL.CHATTER.SHARE")}</button>
                            </div>
                          </div>
                          :
                          <div className='row'>
                            <div className='col-xl-10'>
                              <button className='btn btn-light form-control' onClick={() => setShowPopup(true)}>{t("LABEL.CHATTER.POST_PLACE_HOLDER")}</button>
                            </div>
                            <div className='col-xl-2'>
                              <button className='btn btn-primary form-control' onClick={() => setShowPopup(true)}>{t("LABEL.CHATTER.SHARE")}</button>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  {/* /POST */}
                  {/* QUESTIONS */}
                  <div className="tab-pane fade" id="question">
                    <div className="post-activity">
                      <div className='row'>
                        <div className='col-xl-12'>
                          <div className='row'>
                            <label>{t("LABEL.CHATTER.QUESTION")}</label>
                            <input
                              type='text'
                              className='form-control question-input'
                              value={post.question || ''}
                              onChange={(e) => setPost({ ...post, question: e.target.value })}
                            />
                          </div>
                          <div className='row'>
                            <label>{t("LABEL.CHATTER.DETAILS")}</label>
                            <ReactQuill
                              modules={modules}
                              formats={formats}
                              placeholder={t("LABEL.CHATTER.POST_PLACE_HOLDER")}
                              onChange={(content) => setPost({ ...post, content })}
                              value={post.content || ''}
                            />
                          </div>
                          <div className='row mt-5 share-btn-wrapper'>
                            <button className='btn btn-light col-xl-2 share-btn' onClick={handleCreatePost}>{t("LABEL.CHATTER.SHARE")}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /QUESTIONS */}
                  {/* Polls */}
                  <div className="tab-pane fade" id="polls">
                    <div className="view-header">
                      <h4>{t("LABEL.CHATTER.POLL")}</h4>
                    </div>
                    <div className="poll-activity">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="form-group">
                            <label>{t("LABEL.CHATTER.POLL_QUESTION")}</label>
                            <textarea
                              className="form-control"
                              placeholder={t("LABEL.CHATTER.POLL_QUESTION_PLACEHOLDER")}
                              value={pollQuestion}
                              onChange={handlePollQuestionChange}
                            ></textarea>
                          </div>
                          {pollChoices.map((choice, index) => (
                            <div className="form-group" key={index}>
                              <label>{t("LABEL.CHATTER.POLL_CHOICE")} {index + 1}</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={choice}
                                  onChange={(e) => handlePollChoiceChange(e, index)}
                                />
                                {index === pollChoices.length - 1 && (
                                  <button className="btn btn-light" type="button" onClick={handleAddChoice}>
                                    {t("LABEL.CHATTER.ADD_CHOICE")}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="form-group mt-4">
                            <button className="btn btn-primary" onClick={handleSubmitPoll}>
                              {t("LABEL.CHATTER.CREATE_POLL")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Polls */}
                </div>
              </div>
              {/* Chatter Posts */}
              <PostList
                t={t}
                posts={posts}
                showComment={showComment}
                setShowComment={setShowComment}
                setComment={setComment}
                handleComment={handleComment}
                comment={comment}
                handleShareOption={handleShareOption}
                pollChoices={pollChoices}
                pollQuestion={pollQuestion}
              />
              {/* /Chatter Posts */}
              {/* /Tab Content */}
            </div>
            {/* /Chatter Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ToastContainer />
      {/* Delete Lead Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_account"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>{t("LABEL.ACCOUNTS.DELETE_ACCOUNT")}</h3>
                <p className="del-info">{t("MESSAGE.CONFIRM.DELETE")}</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    {t("ACTION.CANCEL")}
                  </Link>
                  <Link to="#" className="btn btn-danger">
                    {t("ACTION.DELETE")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
    </>
  );
};

export default Chatter;

