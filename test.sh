#!/bin/sh
phpunit --bootstrap $(dirname $0)/view/env.php $1
