---
layout: page
permalink: /publications/
title: publications
description: 
years: [1956, 1950, 1935, 1905]
nav: false
nav_order: 2
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography --query @*[year>=2023] %}

<h2 class="bibliography">Earlier</h2>
{% bibliography --group_by none --query @*[year<=2022] %}

</div>