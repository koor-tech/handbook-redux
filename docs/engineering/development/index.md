---
title: Koor Software Development
outline: [2, 3]
---

# Development Practices

## Dev Process

We use [Linear](https://linear.app/) to manage and record our work.

### General flow

1. Create projects to organize changes
2. Maintain backlogs to manage the activities of completing projects
3. Work in 2-week cycles. For each cycle:
   1. Choose items from the backlog to work on
   2. Assign an owner to each item. The owner is responsible for completing the item. Collaboration is encouraged.
   3. Completed changes must be reviewed by peers. All feedback should be addressed by taking the suggested action or explaining why not.

### Feature Development

A feature is something the software does or allows a user to do. Features are developed in stages by starting with the most basic thing that makes sense to enable. Additional work is done to expand the feature, one capability at a time. We can iterate until the feature is working as desired in every way.

One way to work iteratively is by using user stories. A story takes the form of:

> A \<class-of-user\> wants to \<action-to-take\> so that \<desired-effect-of-action\>.

#### Definition and design

1. Each feature should be explained well enough for someone to get started.
2. Do enough feature design to understand what is to be done.
3. Do technical design to address how the feature's requirements will be satisfied.
4. Break the feature work into stories, written from the perspective of an intended user.
5. Add stories to the backlog.

#### Working on stories

1. When a story is picked up for development, that is the time to ask all of the detailed questions.
   1. Review exisiting designs. Create new designs to fill design gaps.
   2. Write unit tests that prove the functions you create are working.
      1. Remember to test boundary conditions.
      2. Remember to test negative cases -- ensure civilized behavior in the event of problems.
   3. Get the tests to pass by writing code that makes the story work.
   4. Add a system test to cover the happy path where everything is working.
2. Do a PR on your story. Make adjustments based on review comments.
3. Stage completed work as you go. We should be able to use all of the completed stories at the end of each cycle.
