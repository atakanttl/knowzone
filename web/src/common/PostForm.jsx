import { React, useState } from 'react';
import {
  TextField,
  makeStyles,
  IconButton,
  MenuItem,
  Button,
  Modal,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { WHITE, GRAY3, PRIMARY } from '../constants/colors';
import TagPicker from './TagPicker/TagPicker';
import FileUploader from './FileUploader';
import POST_TYPES from '../constants/post-types';

import {
  MAX_LEN_DESCRIPTION,
  MAX_LEN_ERROR,
  MAX_LEN_SOLUTION,
  MAX_NUM_LINKS,
  TOPIC_CONSTRAINTS,
} from '../constants/validation';

const useStyles = makeStyles((theme) => ({
  modalData: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(90% - ${theme.spacing(20)}px)`,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: WHITE,
    padding: theme.spacing(0, 2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    backgroundColor: PRIMARY,
  },
  middleContainer: {
    overflowY: 'auto',
    borderTop: 0,
    border: `1px solid ${GRAY3}`,
    backgroundColor: WHITE,
    padding: theme.spacing(1, 0),
  },
  formDataRow: {
    margin: theme.spacing(3, 2),
  },
  fileUploaderContainer: {
    margin: theme.spacing(0, 2),
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    border: `1px solid ${GRAY3}`,
    borderTop: 0,
    backgroundColor: WHITE,
  },
}));

const FormDataRow = ({ children }) => (
  <div className={useStyles().formDataRow}>
    {children}
  </div>
);

const FormData = ({ title, btnTitle, handleClose, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();
  const [topicsCheck, setTopicsCheck] = useState({ text: '', isInvalid: false, isUnique: true });
  const [descriptionCheck, setDescriptionCheck] = useState({ text: '', isInvalid: false });
  const [errorCheck, setErrorCheck] = useState({ text: '', isInvalid: false });
  const [solutionCheck, setSolutionCheck] = useState({ text: '', isInvalid: false });
  const [linkCheck, setLinkCheck] = useState({ text: '', isInvalid: false });

  const validateDescription = () => {
    let isValid = false;

    if (form.description.length > MAX_LEN_DESCRIPTION) {
      setDescriptionCheck({ text: `Description cannot exceed ${MAX_LEN_DESCRIPTION} characters.`, isInvalid: true });
    } else if (form.description.length === 0) {
      setDescriptionCheck({ text: 'Please fill in the description section.', isInvalid: true });
    } else {
      setDescriptionCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateError = () => {
    let isValid = false;

    if (form.error.length > MAX_LEN_ERROR) {
      setErrorCheck({ text: `Error cannot exceed ${MAX_LEN_ERROR} characters.`, isInvalid: true });
    } else if (form.error.length === 0) {
      setErrorCheck({ text: 'Please fill in the error section.', isInvalid: true });
    } else {
      setErrorCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateSolution = () => {
    let isValid = false;

    if (form.solution.length > MAX_LEN_SOLUTION) {
      setSolutionCheck({ text: `Solution cannot exceed ${MAX_LEN_SOLUTION} characters.`, isInvalid: true });
    } else if (form.solution.length === 0) {
      setSolutionCheck({ text: 'Please fill in the solution section.', isInvalid: true });
    } else {
      setSolutionCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateLinks = () => {
    let isValid = false;

    if (form.links.length > MAX_NUM_LINKS) {
      setLinkCheck({ text: `Number of links cannot exceed ${MAX_NUM_LINKS}.`, isInvalid: true });
    } else {
      setLinkCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateTopics = () => {
    let isValid = false;

    if (form.topics.length < TOPIC_CONSTRAINTS.min) {
      setTopicsCheck({ text: `At least ${TOPIC_CONSTRAINTS.min} topic should be defined.`, isInvalid: true });
    } else if (form.topics.length > TOPIC_CONSTRAINTS.max) {
      setTopicsCheck({ text: `Number of topics cannot exceed ${TOPIC_CONSTRAINTS.max}.`, isInvalid: true });
    } else if (form.topics.length > 0) {
      const matchedTopics = form.topics.map((tag) => tag.match(TOPIC_CONSTRAINTS.pattern));
      console.log(matchedTopics);
      if (matchedTopics.includes(null)) {
        setTopicsCheck({ text: 'Invalid topics.', isInvalid: true });
      } else {
        setTopicsCheck({ text: '', isInvalid: false });
        isValid = true;
      }
    } else {
      setTopicsCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid && topicsCheck.isUnique;
  };

  const validateForm = () => {
    const isValidDescription = validateDescription();
    const isValidLinks = validateLinks();
    const isValidTopics = validateTopics();
    let isValid = isValidDescription && isValidLinks && isValidTopics;

    if (form.type === POST_TYPES.get('bugfix').value) {
      const isValidError = validateError();
      const isValidSolution = validateSolution();
      isValid = isValid && isValidError && isValidSolution;
    }

    if (isValid) {
      onClickBtn();
    }
  };

  return (
    <>
      <div className={classes.topContainer}>
        <h1>{title}</h1>
        <IconButton
          aria-label="close post form"
          style={{ color: WHITE }}
          onClick={handleClose}
        >
          <Close style={{ color: WHITE, width: 35, height: 35 }} />
        </IconButton>
      </div>
      <div className={classes.middleContainer}>
        <FormDataRow>
          <TextField
            id="outlined-select-post-type"
            select
            label="Post Type"
            value={form.type}
            onChange={(e) => handleChangeForm('type', e.target.value)}
            variant="outlined"
            fullWidth
            disabled={form.id !== null && form.id !== undefined}
          >
            {Array.from(POST_TYPES).map(([, opt]) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
            ))}
          </TextField>
        </FormDataRow>
        <FormDataRow>
          <TextField
            name="description"
            variant="outlined"
            required
            fullWidth
            multiline
            minRows={4}
            maxRows={4}
            id="description"
            label="Description"
            value={form.description}
            error={descriptionCheck.isInvalid}
            helperText={descriptionCheck.text}
            onChange={(e) => handleChangeForm('description', e.target.value)}
          />
        </FormDataRow>
        <FormDataRow>
          {form.type === POST_TYPES.get('bugfix').value ? (
            <TextField
              name="error"
              variant="outlined"
              required
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
              id="error"
              label="Error"
              value={form.error}
              error={errorCheck.isInvalid}
              helperText={errorCheck.text}
              onChange={(e) => handleChangeForm('error', e.target.value)}
            />
          ) : null}
        </FormDataRow>
        <FormDataRow>
          {form.type === POST_TYPES.get('bugfix').value ? (
            <TextField
              name="solution"
              variant="outlined"
              required
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
              id="solution"
              label="Solution"
              value={form.solution}
              error={solutionCheck.isInvalid}
              helperText={solutionCheck.text}
              onChange={(e) => handleChangeForm('solution', e.target.value)}
            />
          ) : null}
        </FormDataRow>
        <div className={classes.fileUploaderContainer}>
          <FileUploader
            files={form.images}
            setFiles={(images) => handleChangeForm('images', images)}
          />
        </div>
        <FormDataRow>
          <TagPicker
            tags={form.topics}
            setTags={(topics) => handleChangeForm('topics', topics)}
            required
            unique
            border
            onUniqueError={(unique) => setTopicsCheck(
              { ...topicsCheck, isUnique: unique },
            )}
            error={topicsCheck.isInvalid}
            helperText={topicsCheck.text}
          />
        </FormDataRow>
        <FormDataRow>
          <TagPicker
            tags={form.links}
            setTags={(links) => handleChangeForm('links', links)}
            placeholder="Enter links"
            border
            error={linkCheck.isInvalid}
            helperText={linkCheck.text}
          />
        </FormDataRow>
      </div>
      <div className={classes.bottomContainer}>
        <Button variant="contained" color="primary" onClick={validateForm}>
          {btnTitle}
        </Button>
      </div>
    </>
  );
};

const PostForm = ({ title, btnTitle, open, setOpen, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const ModalData = (
    <div className={classes.modalData}>
      <FormData
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        form={form}
        handleChangeForm={handleChangeForm}
        onClickBtn={onClickBtn}
      />
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>;
};

PostForm.defaultProps = {
  btnTitle: 'share',
};

export default PostForm;
