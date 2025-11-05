'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Mail } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import type { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const initials = `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Avatar + Nombre */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={vendor.photo} alt={`${vendor.firstName} ${vendor.lastName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">
                {vendor.firstName} {vendor.lastName}
              </h3>
              <Badge variant="outline" className="text-xs font-mono mt-1">
                {vendor.document}
              </Badge>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 text-xs">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{vendor.email}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Fecha de registro */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Registrado: {format(new Date(vendor.createdAt), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
