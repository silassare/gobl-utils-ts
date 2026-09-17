<?php

declare(strict_types=1);

namespace GoblUtilsTs\Generator;

/**
 * An enum column of the sample schema: the generator writes it to enums.ts.
 */
enum Status: string
{
	case ACTIVE = 'active';

	case BLOCKED = 'blocked';
}
