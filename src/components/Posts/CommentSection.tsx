import { Input, Textarea, Button, Typography, Grid } from "@mui/joy";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string) {
  return emailRegex.test(email);
}

const url = "https://jsonplaceholder.typicode.com/comments";
export interface CommentFormData {
  name: string;
  email: string;
  comment: string;
}

const defaultCommentDataState = {
  name: "",
  email: "",
  comment: "",
};

const CommentSection = ({
  handleCommentsInput,
}: {
  handleCommentsInput: (userInputComment: CommentFormData) => void;
}) => {
  const [formData, setFormData] = useState<CommentFormData>(defaultCommentDataState);

  const [formErrorData, setFormErrorData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postCommentRequest = async (payload: CommentFormData) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      handleCommentsInput(payload);
      setFormData(defaultCommentDataState);
      setFormErrorData(defaultCommentDataState);
    } catch (err) {
      console.error(err);
      alert("There is something wrong, please try again later");
    }
  };
  const handlePostSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event?.preventDefault?.();
      setIsSubmitting(true);
      const errorForm = {
        name: "",
        email: "",
        comment: "",
      };
      if (!isValidEmail(formData?.email)) {
        errorForm.email = "Please enter a valid email address.";
      }
      if (formData?.name?.length <= 0) {
        errorForm.name = "The name is required.";
      }

      if (formData?.comment?.length <= 0) {
        errorForm.comment = "The comment is required.";
      }
      if (errorForm.email !== "" || errorForm.comment !== "" || errorForm?.name !== "") {
        setFormErrorData(errorForm);
        setIsSubmitting(false);
        return;
      } else {
        postCommentRequest(formData);

        setIsSubmitting(false);
      }
    },
    [setIsSubmitting, postCommentRequest, setFormErrorData, formData]
  );

  const handleDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });

      setFormErrorData((prev) => {
        return { ...prev, [e.target.name]: "" };
      });
    },
    [setFormData, setFormErrorData]
  );

  return (
    <form onSubmit={handlePostSubmit}>
      <Grid container spacing={2} sx={{ mx: 3 }} columns={{ xs: 8, sm: 8, md: 8, lg: 8 }}>
        <Grid xs={12} sm={12} md={6} lg={3}>
          <Input
            size="lg"
            placeholder="name"
            value={formData.name}
            name="name"
            onChange={handleDataChange}
            error={formErrorData?.name !== ""}
            data-testid="nameInput"
          />
          {formErrorData?.name !== "" && (
            <Typography color="danger"> {formErrorData?.name}</Typography>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3}>
          <Input
            size="lg"
            placeholder="email"
            value={formData.email}
            name="email"
            onChange={handleDataChange}
            error={formErrorData?.email !== ""}
            data-testid="emailInput"
          />

          {formErrorData?.email !== "" && (
            <Typography color="danger"> {formErrorData?.email}</Typography>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={6}>
          <Textarea
            placeholder="Type anything…"
            minRows={3}
            value={formData.comment}
            name="comment"
            onChange={handleDataChange}
            error={formErrorData?.comment !== ""}
            data-testid="commentInput"
          />
          {formErrorData?.comment !== "" && (
            <Typography color="danger"> {formErrorData?.comment}</Typography>
          )}
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={6} sx={{ justifyContent: "flex-end" }}>
          <Button
            type="submit"
            data-testid="submitButton"
            disabled={isSubmitting}
            sx={{ width: ["100%", 150], height: 50, my: 2, alignSelf: "flex-end" }}
          >
            Post
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CommentSection;
