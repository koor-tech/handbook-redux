---
title: Koor Software Development
outline: [2, 3]
---

# Software Development

## Development Cycles

Development happens in cycles. A few key cycles drive our work.

1. Weekly dev cycles
   - We do planning every week.
   - We account for what has been finished and make sure everyone is clear about what to do next.
2. Sprint cycles
   - We group work into 2-week cycles, commonly known as sprints.
   - Since we are neither following a strict agile process nor releasing every two weeks, the value of this cycle is low.
3. Release cycle
   - We should be releasing one or more product areas on a regular basis, at least monthly.
   - Releases should be frequent enough to show that we are active.
   - Releases should include enough improvements to be worth the trouble.
4. Quarterly business cycle
   - Every three months, we establish goals and plan high-level activities.

Projects cut across cycles. Larger projects can have milestones that target specific outcomes on a shorter timeline.


## Weekly dev activities

Our weekly dev cycle includes the following activities.

1. **Unstructured time** 
   - vast majority of the week
   - for coding and creating related artifacts: requirements, designs, usage guides, demos, etc.
2. **[Show and tell](show-and-tell)** 
   - to show the results for the past week
   - Follow the link and review the protocol for sharing your work with the team.
   - Help your colleagues by reviewing their work, asking questions, and suggesting improvement ideas.
3. **Retrospective** 
   - Once a month or as needed (when people want to unpack a particular incident). 
   - Reflect on recent past. Acknowledge what is working, and call out what could be better.
4. **Planning** 
   - Review projects in Linear.
   - Update issue statuses, and make sure everyone has assignments for the next week.
   - Avoid having too much or too little work in progress.
5. **Release demos**
   - For recording demonstrations of features to share with the world.
   - Happens as features become ready for use.


## Development Tools

We use [Linear](https://linear.app/) to manage and record our work.
Our repositories are kept at [GitHub](https://github.com/koor-tech).


## Development Stages



### Defining features

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


## Related topics

[Show and Tell](show-and-tell) - sharing details of our work as we go
[Infrastructure](infrastructure) - the systems that support development
[Release Management](release-management) - how we package software and make it available to customers
