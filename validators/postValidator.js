import { body, validationResult } from "express-validator";

const validatePost = [
  body("title").not().isEmpty().withMessage("title cannot empty"),
  body("description").not().isEmpty().withMessage("description cannot empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export { validatePost };
