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

## Dev Activities

Our weekly dev cycle includes the following activities.

1. **Unstructured time**
   - vast majority of the week
   - for coding and creating related artifacts: requirements, designs, usage guides, demos, etc.
2. **Planning**
   - Review projects in Linear.
   - Update issue statuses, and make sure everyone has assignments for the next week.
   - Avoid having too much or too little work in progress.
3. **Progress review &ndash; [Show and tell](show-and-tell)**
   - to show the results for the past week
   - Follow the link and review the protocol for sharing your work with the team.
   - Help your colleagues by reviewing their work, asking questions, and suggesting improvement ideas.
4. **Retrospective**
   - Once a month or as needed (when people want to unpack a particular incident).
   - Reflect on recent past. Acknowledge what is working, and call out what could be better.
5. **Release demos**
   - For recording demonstrations of features to share with the world.
   - Happens as features become ready for use. Ideally we are generating enough exciting results to do this weekly.
   - At a minimum, we should have videos about major features linked from the release notes of each release.

### Weekly Schedule

**Watercooler**: daily x 3
**Show and Tell**: Wednesday @ 9 AM Pacific, 50 minutes
**Planning**: Thursday @ 9 AM Pacific, 25 minutes
**Retrospective**: async, after Show and tell, due by Planning

## Development Tools

We use [Linear](https://linear.app/) to manage and record our work.
Our repositories are kept at [GitHub](https://github.com/koor-tech).
<Badge type="warning" text="ToDo" /> Let's build a complete list at some point.

## Development Stages

### Feature requirements and functional design

Show in words and pictures what features show do. Provide a rough idea of how they should work. Everything in the early stage is a sketch, to be filled in more completely as the feature is developed. Look at the big picture and figure out how the feature works are part of the whole product.

Consider the use cases that a feature is meant to satisfy. What is a user trying to do? How does the feature enable the user to do that?

User stories help to define all of the angles of a use case. A story takes the form of:

> A \<class-of-user\> wants to \<action-to-take\> so that \<desired-effect-of-action\>.

For example:

> A _salesperson_ wants to _keep a list of prospective customers_ so that _he or she can send promotional coupons_.

Under that heading, describe all of the functional details the system should handle to make this happen. A functional detail defines what should happen, not how. Leave the question of how to those implementing the features.

### Working on stories

1. When a story is picked up for development, that is the time to ask all of the detailed questions.
   1. Review exisiting designs. Create new designs to fill design gaps.
   2. Write unit tests that prove the functions you create are working.
      1. Remember to test boundary conditions.
      2. Remember to test negative cases -- ensure civilized behavior in the event of problems.
   3. Get the tests to pass by writing code that makes the story work.
   4. Add a system test to cover the happy path where everything is working.
2. Do a PR on your story. Make adjustments based on review comments.
3. Stage completed work as you go. We should be able to use all of the completed stories at the end of each cycle.

### Implementation

<Badge type="warning" text="ToDo" /> Make this more complete

Briefly, we use the requirements and stories to get features working. At the same time, we add tests that prove things are working as prescribed. For the moment, we are leaving this to developers, leaning heavily on PR reviews and show-and-tell to catch problems.

### Testing

Everyone knows that tests should be written along with implementation. Also, there is always room to add more automated testing once a feature is complete. We need to be disciplined about rounding out our test coverage for what we just completed before moving on to the next features.

We also have the option of running features in our demo system as a way to ensure that they are working as expected. Recording videos of the demo system is a great way to show customers what to expect.

### Release, distribute and deploy

When we build a release (see [Release Management](release-management)), we need to make sure it is distributed where customers can find it. Since we do not run customer systems, deployment is up to our customers. We should deploy to our demo system to make sure the instructions for deployment still work and are easy to follow.

## Related topics

[Project Owner Role](project-owner) - who is responsible for getting things done
[Show and Tell](show-and-tell) - sharing details of our work as we go
[Infrastructure](infrastructure) - the systems that support development
[Linear Guidelines](linear-guidelines) - how we use Linear to manage development work
[Release Management](release-management) - how we package software and make it available to customers
