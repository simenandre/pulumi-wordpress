# Design Specifications

## Goal

Provide a package/template which installs, updates and orchestrates one
WordPress installation running on Google Cloud. It should automatically update
on every minor version, and should be easily configured with a standardized
configuration file.

It should simplify running and developing WordPress, removing the need to have
developers with seniority on the project.

With software like Pulumi, Github Actions etc, we want to simplify setting up
WordPress.

## Background

WordPress has benefits for small and midsized website projects, however
maintaining them in numbers quickly become cumbersome. Running WordPress in a
cloud environment requires experience with cloud architecture, and consequently
DevOps manpower.
