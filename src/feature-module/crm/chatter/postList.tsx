import React from 'react';
import ReactQuill from 'react-quill';
import * as Icons from "react-feather";
import { Dropdown } from 'react-bootstrap';
import { formats, modules } from '../../../core/data/quill/format';
import PollComponent from './pollComponent';

interface Comment {
    content: string;
    user: string;
}

interface Post {
    id?: number;
    user?: string;
    content?: string;
    comments?: Comment[];
    choices?: string[];
    question?: string;
}

interface PostListProps {
    posts: Post[];
    handleComment: (id: number | undefined) => void;
    handleShareOption: (option: any) => void;
    showComment: number[];
    setShowComment: React.Dispatch<React.SetStateAction<number[]>>;
    comment: { user?: string; content?: string; postId?: string; };
    setComment: React.Dispatch<React.SetStateAction<{ user?: string; content?: string; postId?: string; }>>;
    t: (key: string) => string;
    pollQuestion: string;
    pollChoices: string[];
}

const PostList: React.FC<PostListProps> = ({
    posts,
    handleComment,
    handleShareOption,
    showComment,
    setShowComment,
    comment,
    setComment,
    t,
    pollQuestion,
}) => {
    return (
        <div className="contact-tab-view">
            {posts.map((post, index) => (
                <div className='row post-wrapper mb-2' key={index}>
                    <div className='col-xl-12'>
                        <div className='row'>
                            <div className='col-xl-12 d-flex' style={{ alignItems: 'center' }}>
                                <img src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp' className='avatar' alt={post.content} />
                                <div className='row'>
                                    <span style={{ marginLeft: '10px' }} className='link'>{post.user || 'User'}</span>
                                    <span style={{ marginLeft: '10px' }}>{"5 hours ago"}</span>
                                </div>
                            </div>
                            <div className='col-xl-12'>
                                <div className='row'>
                                    <div className='col-xl-12'>
                                        <p className='content-post question' dangerouslySetInnerHTML={{ __html: post.question || '' }}></p>
                                        <p className='content-post' dangerouslySetInnerHTML={{ __html: post.content || '' }}></p>
                                        {
                                            post?.choices && <PollComponent pollChoices={post.choices} pollQuestion={pollQuestion} />
                                        }
                                    </div>
                                    <div className='action mb-2'>
                                        <div className='col-xl-12 d-flex align-items-center mb-2'>
                                            <button className='btn btn-like me-2'>
                                                <Icons.ThumbsUp size={15} />
                                                Like
                                            </button>
                                            <button className='btn btn-like me-2'>
                                                <Icons.MessageCircle size={15} />
                                                Comment
                                            </button>
                                            <Dropdown>
                                                <Dropdown.Toggle className='btn btn-like'>
                                                    <Icons.Share size={15} />
                                                    Share
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleShareOption('group')}>Share with group</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleShareOption('link')}>Copy link</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className='col-xl-12 box-comment'>
                                        <div className='row'>
                                            {post.comments?.map((comment, index) => (
                                                <div className='col-xl-12 comment-row' key={index}>
                                                    <div className='row'>
                                                        <div className='col-xl-12 d-flex' style={{ alignItems: 'center' }}>
                                                            <img src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp' className='avatar' alt={comment.content} />
                                                            <div className='row'>
                                                                <span className='link'>{comment.user || 'User'}</span>
                                                                <span>{"5 hours ago"}</span>
                                                            </div>
                                                        </div>
                                                        <div className='col-xl-12'>
                                                            <div className='row'>
                                                                <div className='col-xl-12'>
                                                                    <p className='comment-content' dangerouslySetInnerHTML={{ __html: comment.content || '' }}></p>
                                                                </div>
                                                                <div className='col-xl-12'>
                                                                    <div className='row'>
                                                                        <div className='col-xl-12'>
                                                                            <button className='btn btn-like'>{t("LABEL.CHATTER.LIKE")}</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='row'>
                                            <div className='col-xl-12 d-flex'>
                                                <img src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp' className='avatar' alt={post.content} />
                                                {
                                                    showComment.includes(post.id as number)
                                                        ?
                                                        <div>
                                                            <ReactQuill
                                                                modules={modules}
                                                                formats={formats}
                                                                placeholder={t("LABEL.CHATTER.COMMENT_PLACE_HOLDER")}
                                                                onChange={(content) => setComment({ content: content })}
                                                                value={comment.content || ''}
                                                            />
                                                            <button className='btn btn-light' onClick={() => handleComment(post.id)}>{t("LABEL.CHATTER.COMMENT")}</button>
                                                        </div>
                                                        :
                                                        <div className='col-xl-12'>
                                                            <button className='btn btn-light col-xl-11' onClick={() => setShowComment([...showComment, post.id as number])}>{t("LABEL.CHATTER.COMMENT_PLACE_HOLDER")}</button>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
